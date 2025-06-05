/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Permet de charger les images du domaine du MET
    domains: ["images.metmuseum.org"],
  },
};

module.exports = nextConfig;
