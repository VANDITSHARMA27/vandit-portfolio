import type { NextConfig } from "next";

// Static export so the site can be hosted on GitHub Pages.
// NEXT_PUBLIC_BASE_PATH is set automatically by the GitHub Actions workflow
// ("" for username.github.io repos, "/repo-name" for project repos).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  turbopack: { root: __dirname },
};

export default nextConfig;
