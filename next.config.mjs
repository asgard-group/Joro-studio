/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    // Plafond à 1920 px : plus de variantes 3840 px (≈ 4× plus lourdes, quasi invisibles à l'écran).
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [],
  },
};

export default nextConfig;
