"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { BusinessTypeExplainer } from "@/components/BusinessTypeExplainer";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { getServiceFlow } from "@/lib/service-registry";
import { buildStartBusinessRoadmap } from "@/lib/start-business-roadmap";
import { syncRoadmapFromChecklist } from "@/lib/checklist-sync";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import type { UserAnswers } from "@/types";

const PASSPORT_LOCATION_LABELS: Record<string, string> = {
  accra: "Accra",
  "cape-coast": "Cape Coast",
  kumasi: "Kumasi",
  other: "Ghana",
};

const GHANA_CARD_LOCATION_LABELS: Record<string, string> = {
  accra: "Accra",
  "cape-coast": "Cape Coast",
  kumasi: "Kumasi",
  other: "Ghana",
};

const GRA_LOCATION_LABELS: Record<string, string> = {
  accra: "Accra",
  "cape-coast": "Cape Coast",
  kumasi: "Kumasi",
  other: "Ghana",
};

const GRA_TAXPAYER_LABELS: Record<string, string> = {
  individual: "Individual taxpayer",
  "self-employed": "Self-employed taxpayer",
  company: "Business/company taxpayer",
  unsure: "General taxpayer support",
};

const NATIONAL_SERVICE_STAGE_LABELS: Record<string, string> = {
  "final-year-completing": "Final year student",
  "completed-awaiting-list": "Graduate awaiting school submission",
  "completed-cleared": "Graduate cleared for posting",
  resit: "Student with pending resit",
};

const NATIONAL_SERVICE_REGION_LABELS: Record<string, string> = {
  "same-region": "Preferred same region",
  "any-region": "Any region",
  "specific-region": "Specific target region",
  unsure: "Ghana",
};

export default function QuestionsPage() {
  const router = useRouter();
  const { answers, setAnswer, setHasCompletedQuestions, currentServiceId } = useAppStore();
  const flow = getServiceFlow(currentServiceId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const answerKey = flow.questionKeyMap[flow.questions[currentIndex]?.id] as keyof UserAnswers;
  const [selected, setSelected] = useState<string>(
    (answerKey ? answers[answerKey] : "") || ""
  );
  const [generating, setGenerating] = useState(false);

  const question = flow.questions[currentIndex];
  const progress = ((currentIndex + 1) / flow.questions.length) * 100;

  const handleNext = () => {
    if (!selected || !answerKey) return;
    setAnswer(answerKey, selected);
    const nextAnswers = { ...answers, [answerKey]: selected };

    if (currentIndex < flow.questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      const nextKey = flow.questionKeyMap[flow.questions[nextIndex].id] as keyof UserAnswers;
      setSelected((nextKey ? answers[nextKey] : "") || "");
    } else {
      setGenerating(true);
      setHasCompletedQuestions(true);

      if (currentServiceId === "passport") {
        const passportType = nextAnswers.passportType;
        useAppStore.setState((state) => ({
          roadmap: {
            ...state.roadmap,
            location: nextAnswers.passportLocation
              ? PASSPORT_LOCATION_LABELS[nextAnswers.passportLocation] ?? "Ghana"
              : state.roadmap.location,
            businessType:
              passportType === "renewal"
                ? "Passport renewal"
                : passportType === "replacement"
                  ? "Passport replacement"
                  : "New passport application",
          },
        }));
      }

      if (currentServiceId === "ghana-card") {
        const ghanaCardType = nextAnswers.ghanaCardType;
        useAppStore.setState((state) => ({
          roadmap: {
            ...state.roadmap,
            location: nextAnswers.ghanaCardLocation
              ? GHANA_CARD_LOCATION_LABELS[nextAnswers.ghanaCardLocation] ?? "Ghana"
              : state.roadmap.location,
            businessType:
              ghanaCardType === "replacement"
                ? "Ghana Card replacement"
                : ghanaCardType === "update"
                  ? "Ghana Card detail update"
                  : "Ghana Card registration",
          },
        }));
      }

      if (currentServiceId === "gra-tin") {
        useAppStore.setState((state) => ({
          roadmap: {
            ...state.roadmap,
            location: nextAnswers.graTaxLocation
              ? GRA_LOCATION_LABELS[nextAnswers.graTaxLocation] ?? "Ghana"
              : state.roadmap.location,
            businessType: nextAnswers.graTaxpayerType
              ? GRA_TAXPAYER_LABELS[nextAnswers.graTaxpayerType] ?? "Taxpayer setup"
              : state.roadmap.businessType,
          },
        }));
      }

      if (currentServiceId === "national-service") {
        useAppStore.setState((state) => ({
          roadmap: {
            ...state.roadmap,
            location: nextAnswers.nationalServiceRegionPreference
              ? NATIONAL_SERVICE_REGION_LABELS[nextAnswers.nationalServiceRegionPreference] ?? "Ghana"
              : state.roadmap.location,
            businessType: nextAnswers.nationalServiceCompletionStatus
              ? NATIONAL_SERVICE_STAGE_LABELS[nextAnswers.nationalServiceCompletionStatus] ??
                "National service candidate"
              : state.roadmap.businessType,
          },
        }));
      }

      if (currentServiceId === "start-business") {
        const personalizedRoadmap = buildStartBusinessRoadmap(nextAnswers);
        const checklist = personalizedRoadmap.checklist.map((item) => ({ ...item, completed: false }));
        useAppStore.setState({
          checklist,
          roadmap: syncRoadmapFromChecklist(checklist, personalizedRoadmap, "start-business"),
        });
      }

      useAppStore.setState((state) => ({
        roadmap: syncRoadmapFromChecklist(state.checklist, state.roadmap, currentServiceId),
      }));

      useAppStore.getState().persistCurrentRoadmap();

      setTimeout(() => router.push("/roadmap"), 1500);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      const prevKey = flow.questionKeyMap[flow.questions[prevIndex].id] as keyof UserAnswers;
      setSelected((prevKey ? answers[prevKey] : "") || "");
    }
  };

  if (!question) {
    return (
      <AppShell title="Service unavailable">
        <div className="mx-auto max-w-md py-20 text-center">
          <p className="mb-4 text-muted">This service does not have a question flow yet.</p>
          <Button onClick={() => router.push("/services")}>Browse services</Button>
        </div>
      </AppShell>
    );
  }

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
          <p className="text-muted">{flow.generatingMessage}</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Smart Questions">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-primary">
            Question {currentIndex + 1} of {flow.questions.length}
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

            <div className="mb-6">
              {question.showBusinessTypeHelp ? (
                <BusinessTypeExplainer
                  selectable
                  selectedId={selected}
                  onSelect={setSelected}
                />
              ) : (
                <div className="space-y-3">
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
              )}
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
            {currentIndex === flow.questions.length - 1 ? "Build Roadmap" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
