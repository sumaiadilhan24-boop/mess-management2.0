import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
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
        }}
      >
        <div
          style={{
            width: "68%",
            height: "68%",
            borderRadius: "28%",
            background: "rgba(255, 255, 255, 0.12)",
            border: "16px solid rgba(255, 255, 255, 0.18)",
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
              borderRadius: "0 0 140px 140px",
              border: "20px solid #f8fafc",
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