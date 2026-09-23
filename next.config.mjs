/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/recipe-khazana',
        destination: '/recipe',
        permanent: true,
      },
      {
        source: '/recipe-khazana/:slug',
        destination: '/recipe/:slug',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/pathshala',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
