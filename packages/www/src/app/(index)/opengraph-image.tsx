import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

// Image metadata
export const alt = "Keita Ito";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  // フォントファイルの絶対パスを使用
  const playfairDisplayRegular = await fetchFont(
    "Keita Ito",
    "Playfair+Display",
  );
  if (!playfairDisplayRegular) {
    throw new Error("Font not found");
  }

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background:
            "linear-gradient(135deg, #14B8A6 0%, #0891B2 50%, #0E7490 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
        }}
      >
        {/* 内側のコンテンツ - 角丸の白背景 */}
        <div
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)",
            width: "100%",
            height: "100%",
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            padding: "40px",
            position: "relative",
            boxShadow:
              "0 10px 30px rgba(0, 0, 0, 0.15), 0 0 6px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* メインコンテンツ - 中央に配置 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              gap: "80px",
            }}
          >
            {/* アイコン */}
            <div
              style={{
                borderRadius: "50%",
                overflow: "hidden",
                width: "300px",
                height: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow:
                  "0 10px 25px rgba(20, 184, 166, 0.4), 0 6px 12px rgba(20, 184, 166, 0.15)",
              }}
            >
              <img
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                src={await getIconImage()}
                alt={alt}
                width={300}
                height={300}
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* 名前 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <h1
                style={{
                  fontSize: "72px",
                  fontFamily: "'Playfair Display', serif",
                  margin: 0,
                  color: "#333333",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                Keita Ito
              </h1>
              <p
                style={{
                  fontSize: "32px",
                  color: "#666666",
                  margin: 0,
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.05)",
                }}
              >
                伊藤 啓太
              </p>
            </div>
          </div>

          {/* ロゴ - 右下に配置 */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              right: "40px",
              width: "317px",
              height: "39px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              filter: "drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1))",
            }}
          >
            <img src={await getLogoImage()} alt="" width={317} height={39} />
          </div>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      width: size.width,
      height: size.height,
      fonts: [
        {
          name: "Playfair Display",
          data: playfairDisplayRegular,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}

async function getLogoImage() {
  const svgBuffer = await readFile(join(process.cwd(), "public/logo.svg"));
  const base64 = svgBuffer.toString("base64");
  const dataUri = `data:image/svg+xml;base64,${base64}`;
  return dataUri;
}

async function getIconImage() {
  const data = await readFile(join(process.cwd(), "./public/icon_full.jpg"));
  const src = Uint8Array.from(data).buffer;
  return src;
}

async function fetchFont(
  text: string,
  font: string,
): Promise<ArrayBuffer | null> {
  const API = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
    text,
  )}`;

  const css = await (
    await fetch(API, {
      headers: {
        // Make sure it returns TTF.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    })
  ).text();

  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  );

  if (!resource) return null;

  const res = await fetch(resource[1]);

  return res.arrayBuffer();
}
