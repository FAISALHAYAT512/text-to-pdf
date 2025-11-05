import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true, // React compiler enabled
  experimental: {
    turbopack: false, // ✅ Turbopack temporarily disabled (build error fix)
  },
  // Optional: Future proof settings
  compiler: {
    styledComponents: true, // Agar aap styled-components use karte ho
  },
};

export default nextConfig;
