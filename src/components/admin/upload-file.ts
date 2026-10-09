import { MAX_IMAGE_UPLOAD_BYTES, MAX_IMAGE_UPLOAD_MB } from "@/lib/upload";

/** Uploads one image to Cloudinary via the admin-only route and returns its URL. */
export async function uploadFile(file: File): Promise<string> {
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    throw new Error(`Image is too large — keep it under ${MAX_IMAGE_UPLOAD_MB}MB.`);
  }

  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Upload failed");
  }
  const body = (await res.json()) as { url: string };
  return body.url;
}
