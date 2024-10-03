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
      'https://avatar.vercel.sh/jack',
      'avatar.vercel.sh'
    ],
  },
//   webpack: (config, { isServer }) => {
//     // Add WebAssembly support
//     config.experiments = { ...config.experiments, asyncWebAssembly: true };
//     config.module.rules.push({
//       test: /\.wasm$/,
//       type: 'webassembly/async',
//     });

//     return config;
//   },
// };
};


export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
})(nextConfig);
