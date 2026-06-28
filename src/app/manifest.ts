import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GovFlow AI",
    short_name: "GovFlow",
    description:
      "Government services made simple. Get roadmaps, checklists, and guided support for Ghana services.",
    start_url: "/home",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#0F6B4F",
    categories: ["productivity", "utilities", "government"],
    icons: [
      {
        src: "/govflow-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/govflow-logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
