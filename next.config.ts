import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components and partial prefetching are intentionally disabled until
  // the analytics layer is stable: every admin route is session-dependent, and
  // the project favours predictable dynamic rendering over opt-in caching.
  //
  // authInterrupts enables forbidden()/unauthorized() so a non-admin session
  // hitting /admin receives a real 403 instead of a silent redirect.
  experimental: {
    authInterrupts: true,
  },
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
