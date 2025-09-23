/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: "/api/:path*", // Toutes les requêtes vers /api
          destination: "http://192.168.1.18:4000/api/:path*", // Redirige vers le backend
        },
      ];
    },
  };
  
  export default nextConfig;
  