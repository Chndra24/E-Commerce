import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components and partial prefetching are intentionally disabled until the
  // auth layer lands (M1 Fase B): every admin route is session-dependent, and the
  // project favours predictable dynamic rendering over opt-in caching.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
