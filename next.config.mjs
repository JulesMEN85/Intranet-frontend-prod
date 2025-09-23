/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: "/api/:path*", // Toutes les requêtes vers /api
          destination: "http://localhost:4000/api/:path*", // Redirige vers le backend
        },
      ];
    },
  };
  
  export default nextConfig;
  