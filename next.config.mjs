/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Outputs a Single-Page Application (SPA).
  distDir: process.env.BUILD_DIR || "./build", // Changes the build output directory to `./dist/`.
  // eslint-disable-next-line no-undef
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
};

export default nextConfig;
