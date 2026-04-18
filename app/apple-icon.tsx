import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "38px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: "68px",
            letterSpacing: "-2px",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#ffffff" }}>h</span>
          <span style={{ color: "#34d399" }}>by</span>
          <span style={{ color: "#ffffff" }}>a</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
