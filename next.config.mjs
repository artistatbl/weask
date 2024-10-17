import withPWA from 'next-pwa';
import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        hostname: 'img.clerk.com',
        protocol: 'https',
      },
      {
        hostname: 'cdn.sanity.io',
        protocol: 'https',
      },
      {
        hostname: 'api.dicebear.com',
        protocol: 'https',
      },
    ],
  },
  productionBrowserSourceMaps: true,
  webpack: (config) => { // Removed unused { isServer }
    // Add WebAssembly support
    config.experiments = { asyncWebAssembly: true, layers: true };
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    return config;
  },
  experimental: {
    outputFileTracingIncludes: {
      "/api/**/*": ["./node_modules/**/*.wasm", "./node_modules/tiktoken/**/*.wasm"],
      "/*": ["./cache/**/*"],
    },
    serverComponentsExternalPackages: ["sharp", "onnxruntime-node", "tiktoken"],
  },
};

const pwaConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  fallbacks: {
    image: '/static/images/fallback.png',
    document: '/offline',
  },
})(nextConfig);

const sentryConfig = withSentryConfig(pwaConfig, {
  org: "nexusflow",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
  telemetry: false,
});

export default sentryConfig;

export async function headers() {
  return [
    {
      source: '/_next/static/media/a34f9d1faa5f3315-s.p.woff2',
      headers: [
        {
          key: 'Link',
          value: '</_next/static/media/a34f9d1faa5f3315-s.p.woff2>; rel=preload; as=font; type="font/woff2"; crossorigin="anonymous"',
        },
      ],
    },
  ];
}