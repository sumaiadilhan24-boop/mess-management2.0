import { ImageResponse } from "next/og";

const SUPPORTED_SIZES = [192, 512] as const;

export const runtime = "edge";

function createIcon(size: number) {
  const frameBorder = size >= 512 ? 16 : 8;
  const bowlBorder = size >= 512 ? 20 : 10;

  return (
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
          border: `${frameBorder}px solid rgba(255, 255, 255, 0.18)`,
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
            border: `${bowlBorder}px solid #f8fafc`,
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
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ size: string }> }
) {
  const resolved = await params;
  const parsedSize = Number.parseInt(resolved.size, 10);

  if (!SUPPORTED_SIZES.includes(parsedSize as (typeof SUPPORTED_SIZES)[number])) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(createIcon(parsedSize), {
    width: parsedSize,
    height: parsedSize,
  });
}