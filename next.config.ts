import type { NextConfig } from "next";
import webpack from "webpack";

const nextConfig: NextConfig = {
  // Use webpack for production builds to avoid test file bundling issues with Turbopack
  webpack: (config, { isServer }) => {
    // Use IgnorePlugin to exclude test files and other non-production files
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/test/,
        contextRegExp: /thread-stream/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /\.(test|spec)\.(js|ts|mjs|cjs)$/,
        contextRegExp: /node_modules/,
      })
    );

    return config;
  },
};

export default nextConfig;
