"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/components/admin/upload-file";
import { cn } from "@/lib/utils";

export function MultiImageUploadField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  async function handleFiles(files: FileList | null) {
    const images = Array.from(files ?? []).filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) return;

    setPending(images.length);
    // The upload route takes one file per request, so these go up one at a
    // time. Collect locally and commit once — calling onChange per upload would
    // race against the parent's state updates.
    const uploaded: string[] = [];
    for (const file of images) {
      try {
        uploaded.push(await uploadFile(file));
      } catch (error) {
        toast.error(`${file.name}: ${error instanceof Error ? error.message : "Upload failed"}`);
      } finally {
        setPending((n) => n - 1);
      }
    }
    if (uploaded.length > 0) onChange([...value, ...uploaded]);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      <span className="text-sm font-medium text-foreground">{label}</span>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}

      {value.length > 0 && (
        <ul className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((url, i) => (
            <li key={`${url}-${i}`} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element -- may be a pre-existing /images/... path or an external URL */}
              <img src={url} alt={`${label} ${i + 1}`} className="size-full object-cover" />

              <button
                type="button"
                onClick={() => onChange(value.filter((_, index) => index !== i))}
                className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow"
                aria-label={`Remove image ${i + 1}`}
              >
                <X className="size-3.5" />
              </button>

              <div className="absolute inset-x-1 bottom-1 flex justify-between">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow disabled:opacity-30"
                  aria-label={`Move image ${i + 1} earlier`}
                >
                  <ArrowLeft className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  className="flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow disabled:opacity-30"
                  aria-label={`Move image ${i + 1} later`}
                >
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

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
          "mt-3 flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center transition-colors",
          isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        )}
      >
        {pending > 0 ? (
          <>
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Uploading {pending} photo{pending === 1 ? "" : "s"}...
            </span>
          </>
        ) : (
          <>
            <Upload className="size-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Click or drag photos here — you can pick several at once</span>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          // Let the same file be picked again after removing it.
          e.target.value = "";
        }}
      />
    </div>
  );
}
