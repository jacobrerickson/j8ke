/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        serverActions: {
            allowedOrigins: ['localhost:3010', 'localhost:3000'],
        },
    },
    // Configure allowed image domains
    images: {
        domains: ['images.unsplash.com'],
    },
};

module.exports = nextConfig;