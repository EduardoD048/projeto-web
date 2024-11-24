/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'ibb.co',
            port: '',
            pathname: '/**',
          },
    ]}
};

export default nextConfig;
