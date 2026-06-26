"use client";

import { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, FileText, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentUploadCardProps {
  onUpload: (fileName: string) => void;
}

export function DocumentUploadCard({ onUpload }: DocumentUploadCardProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleMockUpload = useCallback(
    (name: string) => {
      onUpload(name);
    },
    [onUpload]
  );

  return (
    <Card>
      <CardContent className="p-6">
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
            handleMockUpload(file?.name || "uploaded-document.pdf");
          }}
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-soft-blue text-primary">
            <Upload className="h-8 w-8" />
          </div>
          <p className="mb-2 text-lg font-semibold">Drop your document here</p>
          <p className="mb-6 text-sm text-muted">PDF, JPG, PNG, government forms, receipts, letters</p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={() => handleMockUpload("photo-capture.jpg")}>
              <Camera className="h-4 w-4" />
              Take Photo
            </Button>
            <Button variant="outline" onClick={() => handleMockUpload("document.pdf")}>
              <FileText className="h-4 w-4" />
              Upload PDF
            </Button>
            <Button variant="outline" onClick={() => handleMockUpload("document.png")}>
              <ImageIcon className="h-4 w-4" />
              Upload Image
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
