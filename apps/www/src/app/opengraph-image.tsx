import { ImageResponse } from "next/og";

export const alt = "Keita Ito - ポートフォリオサイト";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const colors = {
    primary: "#14b8a6",
    primaryDark: "#0f766e",
    primaryDarker: "#134e4a",
    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
  };

  const styles = {
    container: {
      background: colors.background,
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      padding: 80,
      fontFamily: "system-ui, sans-serif",
    },
    title: {
      fontSize: 72,
      fontWeight: "bold" as const,
      color: colors.primary,
      marginBottom: 24,
      textAlign: "center" as const,
    },
    subtitle: {
      fontSize: 32,
      color: colors.primaryDark,
      marginBottom: 40,
      textAlign: "center" as const,
    },
    description: {
      fontSize: 28,
      color: colors.primaryDarker,
      textAlign: "center" as const,
    },
    accent: {
      position: "absolute" as const,
      bottom: 60,
      right: 80,
      width: 120,
      height: 4,
      background: colors.primary,
    },
  };

  return new ImageResponse(
    (
      <div style={styles.container}>
        <div style={styles.title}>Keita Ito</div>
        <div style={styles.subtitle}>伊藤啓太</div>
        <div style={styles.description}>Frontend Developer</div>
        <div style={styles.accent} />
      </div>
    ),
    {
      ...size,
    },
  );
}
