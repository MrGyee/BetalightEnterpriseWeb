"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/components/admin/upload-file";
import { cn } from "@/lib/utils";

export function ImageUploadField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative mt-1.5 flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center transition-colors",
          isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        )}
      >
        {value && !isUploading ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- value may be a pre-existing /images/... path or an external URL, not just Cloudinary */}
            <img src={value} alt={label} className="absolute inset-0 size-full rounded-[10px] object-cover" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </button>
          </>
        ) : isUploading ? (
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        ) : (
          <>
            <Upload className="size-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Click or drag an image here</span>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
    </div>
  );
}
