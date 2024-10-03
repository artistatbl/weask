import withPWA from 'next-pwa';

const nextConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})({
  // Your other Next.js config options here
});

export default nextConfig;
