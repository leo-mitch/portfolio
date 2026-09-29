import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export for GitHub Pages (served at the root of leo-mitch.me).
  output: "export",
  // Emit /route/index.html so a static host resolves clean URLs reliably.
  trailingSlash: true,
  // No image optimization server in a static export; we use plain <img> anyway.
  images: { unoptimized: true },
};

export default nextConfig;
