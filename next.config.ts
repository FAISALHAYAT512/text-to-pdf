import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true, // React compiler enabled
  // Optional: Future proof settings
  compiler: {
    styledComponents: true, // Agar aap styled-components use karte ho
  },
};

export default nextConfig;
