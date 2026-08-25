import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getProductBySlug } from "@/lib/data/catalog";
import { siteConfig } from "@/lib/site-config";

// node:fs is used to read the local logo/product images, so this can't run
// on the default Edge runtime.
export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} product`;

async function toDataUri(pathOrUrl: string): Promise<string> {
  if (pathOrUrl.startsWith("http")) {
    const res = await fetch(pathOrUrl);
    const buf = Buffer.from(await res.arrayBuffer());
    const mime = res.headers.get("content-type") ?? "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  }
  const filePath = path.join(process.cwd(), "public", pathOrUrl);
  const buf = await readFile(filePath);
  const ext = path.extname(pathOrUrl).slice(1).toLowerCase();
  const mime = ext === "png" ? "image/png" : ext === "svg" ? "image/svg+xml" : ext === "webp" ? "image/webp" : "image/jpeg";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  // 160px variant — the full logo is 1600x1600/210KB and renders here at 56px.
  const logoUri = await toDataUri("/images/brand/betalight-logo-mark.jpeg").catch(() => null);
  const productImageUri = product ? await toDataUri(product.imagePath).catch(() => null) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "36px 56px 0" }}>
          {logoUri && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUri} width={56} height={56} style={{ borderRadius: "50%" }} alt="" />
          )}
          <span style={{ fontSize: 26, fontWeight: 800, color: "#1F2937" }}>{siteConfig.name}</span>
        </div>

        <div style={{ display: "flex", flex: 1, padding: "24px 56px 0", gap: 48 }}>
          <div
            style={{
              width: 420,
              height: 420,
              borderRadius: 24,
              overflow: "hidden",
              display: "flex",
              background: "#f3f4f6",
              flexShrink: 0,
            }}
          >
            {productImageUri && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={productImageUri} width={420} height={420} style={{ objectFit: "cover" }} alt="" />
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingTop: 12 }}>
            {product && (
              <span
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  background: "#FEF3E2",
                  color: "#F57C00",
                  fontSize: 20,
                  fontWeight: 700,
                  padding: "8px 18px",
                  borderRadius: 999,
                }}
              >
                {product.category}
              </span>
            )}
            <span
              style={{
                marginTop: 22,
                fontSize: 48,
                fontWeight: 800,
                color: "#111827",
                lineHeight: 1.15,
                display: "flex",
              }}
            >
              {product?.name ?? siteConfig.name}
            </span>
            <span style={{ marginTop: 18, fontSize: 24, color: "#4B5563", lineHeight: 1.4, display: "flex" }}>
              {product?.shortDescription ?? siteConfig.description}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#F57C00",
            padding: "28px 56px",
            marginTop: 24,
          }}
        >
          <span style={{ fontSize: 28, fontWeight: 800, color: "#ffffff" }}>Request Quote Today</span>
          <span style={{ fontSize: 22, fontWeight: 600, color: "#ffffff" }}>{siteConfig.url.replace(/^https?:\/\//, "")}</span>
        </div>
      </div>
    ),
    {
      ...size,
      // This PNG exists only for social-card crawlers (WhatsApp, Facebook,
      // LinkedIn) to fetch via og:image — it must stay public and un-auth'd,
      // but Google indexing it as a standalone result is noise, not a page.
      headers: { "X-Robots-Tag": "noindex" },
    }
  );
}
