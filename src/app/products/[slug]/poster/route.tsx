import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";
import { getProductBySlug } from "@/lib/data/catalog";
import { getSiteSettings } from "@/lib/data/settings";
import { siteConfig } from "@/lib/site-config";
import { absoluteProductUrl } from "@/lib/share";

export const runtime = "nodejs";

async function toDataUri(pathOrUrl: string): Promise<string | null> {
  try {
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
  } catch {
    return null;
  }
}

const features = ["Installation Available", "Warranty Included", "Energy Efficient"];

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) {
    return new Response("Product not found", { status: 404 });
  }

  const settings = await getSiteSettings();
  const productUrl = absoluteProductUrl(product.slug);

  const [logoUri, productImageUri, qrUri] = await Promise.all([
    toDataUri("/images/brand/betalight-logo.jpeg"),
    toDataUri(product.imagePath),
    QRCode.toDataURL(productUrl, { margin: 1, width: 240, color: { dark: "#1F2937", light: "#FFFFFF" } }),
  ]);

  const image = new ImageResponse(
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
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "48px 56px 0" }}>
          {logoUri && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUri} width={72} height={72} style={{ borderRadius: "50%" }} alt="" />
          )}
          <span style={{ fontSize: 32, fontWeight: 800, color: "#1F2937" }}>{siteConfig.name}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
          <span
            style={{
              display: "flex",
              background: "#FEF3E2",
              color: "#F57C00",
              fontSize: 26,
              fontWeight: 700,
              padding: "10px 26px",
              borderRadius: 999,
            }}
          >
            {product.category}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 28, padding: "0 56px" }}>
          <div
            style={{
              width: 780,
              height: 780,
              borderRadius: 32,
              overflow: "hidden",
              display: "flex",
              background: "#f3f4f6",
            }}
          >
            {productImageUri && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={productImageUri} width={780} height={780} style={{ objectFit: "cover" }} alt="" />
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 72px 0", textAlign: "center" }}>
          <span style={{ fontSize: 54, fontWeight: 800, color: "#111827", lineHeight: 1.15, display: "flex" }}>
            {product.name}
          </span>
          <span style={{ marginTop: 18, fontSize: 28, color: "#4B5563", lineHeight: 1.4, display: "flex" }}>
            {product.shortDescription}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 36 }}>
          {features.map((feature) => (
            <span
              key={feature}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#F0FDF4",
                color: "#2E7D32",
                fontSize: 22,
                fontWeight: 600,
                padding: "12px 22px",
                borderRadius: 999,
              }}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth={3}>
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {feature}
            </span>
          ))}
        </div>

        {/* Soaks up leftover height so the CTA sits at the bottom for
            products with shorter descriptions. */}
        <div style={{ display: "flex", flex: 1 }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#F57C00",
            padding: "40px 56px",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 34, fontWeight: 800, color: "#ffffff" }}>Request Quote on WhatsApp</span>
          <span style={{ fontSize: 26, fontWeight: 600, color: "#ffffff" }}>+{settings.whatsappNumber}</span>
          <span style={{ fontSize: 20, fontWeight: 500, color: "#ffffff", opacity: 0.9 }}>
            {siteConfig.url.replace(/^https?:\/\//, "")}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "center", padding: "36px 0 44px" }}>
          <div
            style={{
              display: "flex",
              padding: 14,
              background: "#ffffff",
              borderRadius: 16,
              border: "1px solid #E5E7EB",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUri} width={184} height={184} alt="" />
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
      headers: {
        "Content-Disposition": `attachment; filename="${product.slug}-betalight-poster.png"`,
        "Cache-Control": "public, max-age=3600",
      },
    }
  );

  return image;
}
