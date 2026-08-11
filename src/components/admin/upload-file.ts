/** Uploads one image to Cloudinary via the admin-only route and returns its URL. */
export async function uploadFile(file: File): Promise<string> {
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
