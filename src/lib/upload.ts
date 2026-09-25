// Vercel serverless functions reject request bodies above a few MB before our
// route handler even runs, and a raw phone photo can easily exceed that — so
// this is checked client-side (for a clear error) and server-side (the actual
// boundary, since a client check alone can be bypassed).
export const MAX_IMAGE_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_IMAGE_UPLOAD_MB = MAX_IMAGE_UPLOAD_BYTES / (1024 * 1024);
