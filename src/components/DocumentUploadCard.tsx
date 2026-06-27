"use client";

import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, FileText, ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentUploadCardProps {
  onUpload: (file: File) => void;
}

export function DocumentUploadCard({ onUpload }: DocumentUploadCardProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = (file: File | undefined) => {
    if (!file) return;
    setSelectedFileName(file.name);
    onUpload(file);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          className="hidden"
          onChange={(event) => handleUpload(event.target.files?.[0])}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleUpload(event.target.files?.[0])}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(event) => handleUpload(event.target.files?.[0])}
        />

        <div
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors",
            dragOver ? "border-primary bg-soft-blue/50" : "border-gray-200 bg-gray-50/50"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            handleUpload(file);
          }}
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-soft-blue text-primary">
            <Upload className="h-8 w-8" />
          </div>
          <p className="mb-2 text-lg font-semibold">Drop your document here</p>
          <p className="mb-6 text-sm text-muted">
            PDF, JPG, PNG, DOC, DOCX, TXT, government forms, receipts, letters
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={() => cameraInputRef.current?.click()}>
              <Camera className="h-4 w-4" />
              Take Photo
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <FileText className="h-4 w-4" />
              Upload Document
            </Button>
            <Button variant="outline" onClick={() => imageInputRef.current?.click()}>
              <ImageIcon className="h-4 w-4" />
              Upload Image
            </Button>
          </div>

          {selectedFileName ? (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-primary-dark">
              <FileText className="h-4 w-4" />
              <span className="max-w-[220px] truncate font-medium">{selectedFileName}</span>
              <button
                type="button"
                onClick={() => setSelectedFileName("")}
                className="rounded p-0.5 text-muted transition hover:bg-gray-100 hover:text-foreground"
                aria-label="Clear selected file name"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
