"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";

export default function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div className="max-w-2xl mx-auto p-6">
      <FileUpload onChange={(newFiles) => setFiles(newFiles)} />
      <pre className="text-xs text-neutral-400 mt-4">
        {files
          .map((f) => `${f.name} - ${(f.size / 1024).toFixed(1)} KB`)
          .join("\n")}
      </pre>
    </div>
  );
}
