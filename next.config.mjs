import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'img.clerk.com',
      'cdn.sanity.io',
      'images.unsplash.com',
      'assets.aceternity.com',
      'avatar.vercel.sh' // Corrected the domain here
    ],
  },
  productionBrowserSourceMaps: true,
  webpack: (config, { isServer }) => {
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

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
})(nextConfig);
