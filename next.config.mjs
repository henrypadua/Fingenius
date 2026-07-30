/** @type {import('next').NextConfig} */

// When deploying to GitHub Pages (a project site served from
// https://<user>.github.io/<repo>/), the app must be prefixed with the
// repository name. The workflow sets NEXT_PUBLIC_BASE_PATH="/Fingenius".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig = {
  reactStrictMode: true,
  // Produce a fully static site in ./out so it can be served by GitHub Pages.
  output: "export",
  basePath,
  // GitHub Pages serves paths without trailing-slash rewrites; this makes
  // each route resolve to its own index.html.
  trailingSlash: true,
  images: {
    // next/image optimization requires a server; disable it for static export.
    unoptimized: true,
  },
};

export default nextConfig;
