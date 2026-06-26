"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { foodBusinessQuestions } from "@/data/questions";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import type { UserAnswers } from "@/types";

const answerKeys: (keyof UserAnswers)[] = [
  "businessType",
  "foodPreparation",
  "location",
  "businessName",
  "hiring",
];

export default function QuestionsPage() {
  const router = useRouter();
  const { answers, setAnswer, setHasCompletedQuestions } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string>(
    answers[answerKeys[currentIndex]] || ""
  );
  const [generating, setGenerating] = useState(false);

  const question = foodBusinessQuestions[currentIndex];
  const progress = ((currentIndex + 1) / foodBusinessQuestions.length) * 100;

  const handleNext = () => {
    if (!selected) return;
    setAnswer(answerKeys[currentIndex], selected);

    if (currentIndex < foodBusinessQuestions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelected(answers[answerKeys[nextIndex]] || "");
    } else {
      setGenerating(true);
      setHasCompletedQuestions(true);
      setTimeout(() => router.push("/roadmap"), 1500);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelected(answers[answerKeys[prevIndex]] || "");
    }
  };

  if (generating) {
    return (
      <AppShell title="Building Roadmap" showChat={false}>
        <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="mb-6 h-16 w-16 rounded-full border-4 border-primary border-t-transparent"
          />
          <h2 className="mb-2 text-2xl font-bold">Generating your roadmap...</h2>
          <p className="text-muted">
            Building steps for business registration, tax, FDA, and local permits in Cape Coast.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Smart Questions">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-primary">
            Question {currentIndex + 1} of {foodBusinessQuestions.length}
          </p>
          <ProgressBar value={progress} size="sm" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
              {question.question}
            </h1>

            <div className="mb-6 space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelected(option.id)}
                  className={cn(
                    "w-full rounded-2xl border-2 p-5 text-left text-base font-medium transition-all",
                    selected === option.id
                      ? "border-primary bg-soft-blue text-primary-dark"
                      : "border-gray-100 bg-white hover:border-primary/30"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="mb-8 flex items-start gap-3 rounded-xl bg-soft-blue/50 p-4">
              <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-primary-dark">Why we ask</p>
                <p className="text-sm text-muted">{question.whyWeAsk}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="flex-1 sm:flex-none"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!selected} className="flex-1 sm:flex-none">
            {currentIndex === foodBusinessQuestions.length - 1 ? "Build Roadmap" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
