import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Betalight Enterprises Ltd — Electrical, Solar & Power Control Solutions in Kenya";

const logoDataUri = `data:image/jpeg;base64,${readFileSync(
  join(process.cwd(), "public", "images", "brand", "betalight-logo.jpeg")
).toString("base64")}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1F2937 0%, #14532d 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoDataUri} alt="" width={110} height={110} style={{ borderRadius: 999, marginBottom: 32 }} />
        <div style={{ display: "flex", fontSize: 60, fontWeight: 800, letterSpacing: -1 }}>Betalight Enterprises Ltd</div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 16, color: "#FFB74D" }}>
          Electrical, Solar &amp; Power Control Solutions in Kenya
        </div>
      </div>
    ),
    { ...size }
  );
}
