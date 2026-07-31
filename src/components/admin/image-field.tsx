"use client";

import { ImageOff } from "lucide-react";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";

export function ImageField({
  label,
  htmlFor,
  value,
  onChange,
}: {
  label: string;
  htmlFor: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <FormField label={label} htmlFor={htmlFor}>
      <div className="flex items-center gap-3">
        <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-entered URLs aren't in next/image's allowed remote hosts
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <ImageOff className="size-5 text-muted-foreground" />
          )}
        </div>
        <Input
          id={htmlFor}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/products/example.jpeg or https://..."
          className="flex-1"
        />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Path to a file already in <code>public/images/</code>, or a full image URL.
      </p>
    </FormField>
  );
}
