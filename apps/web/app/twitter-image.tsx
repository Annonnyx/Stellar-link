import { ImageResponse } from "next/og";

export const alt = "Nova Studio — Agence Créative";
export const size = { width: 1200, height: 600 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}
          >
            <span style={{ display: "flex" }}>✦</span>
          </div>
          <div style={{ display: "flex", fontSize: "48px", fontWeight: "bold" }}>
            <span style={{ display: "flex" }}>Nova</span>
            <span style={{ display: "flex", color: "#8b5cf6" }}>Studio</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: "28px", color: "#a1a1aa", textAlign: "center" }}>
          L&apos;agence créative qui connecte les meilleurs talents
        </div>
      </div>
    ),
    { ...size }
  );
}
