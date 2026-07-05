import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 30%, #6366f1 0%, #4338ca 45%, #0f172a 100%)",
          borderRadius: "24%",
        }}
      >
        <div
          style={{
            width: "68%",
            height: "68%",
            borderRadius: "28%",
            background: "rgba(255, 255, 255, 0.14)",
            border: "6px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "66%",
              height: "44%",
              borderRadius: "0 0 70px 70px",
              border: "8px solid #f8fafc",
              borderTop: "0",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "28%",
              width: "44%",
              height: "8%",
              borderRadius: "999px",
              background: "#f8fafc",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "14%",
              top: "16%",
              width: "8%",
              height: "36%",
              borderRadius: "999px",
              background: "#f8fafc",
              transform: "rotate(24deg)",
            }}
          />
        </div>
      </div>
    ),
    size
  );
}