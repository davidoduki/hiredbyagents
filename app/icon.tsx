import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "7px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "-0.5px",
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
