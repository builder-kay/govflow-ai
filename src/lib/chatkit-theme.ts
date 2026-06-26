import type { ThemeOption } from "@openai/chatkit";

/**
 * ChatKit Studio "tinted grayscale" light theme, tuned to GovFlow brand green.
 * @see https://chatkit.studio/playground
 */
export function getChatKitTheme(compact = false): ThemeOption {
  return {
    colorScheme: "light",
    color: {
      grayscale: {
        hue: 162,
        tint: 6,
        shade: -2,
      },
      accent: {
        primary: "#0F6B4F",
        level: 2,
      },
    },
    radius: "pill",
    density: compact ? "compact" : "normal",
    typography: {
      fontFamily: "OpenAI Sans, system-ui, sans-serif",
      baseSize: 16,
    },
  };
}
