import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.clerk.com',
       'cdn.sanity.io',
      'images.unsplash.com',
      'assets.aceternity.com',
      'https://avatar.vercel.sh/jack',
      'avatar.vercel.sh'
      ],
  },
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
})(nextConfig);
