import type { NextConfig } from "next";

const BACKEND_URL = (process.env.BACKEND_URL ?? "http://localhost:5050").replace(/\/$/, "");

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  // Browser requests go to /backend/* on this site and Next forwards them to the backend,
  // so the frontend works on any port without CORS problems.
  async rewrites() {
    return [{ source: "/backend/:path*", destination: `${BACKEND_URL}/api/v1/:path*` }];
  },
};

export default nextConfig;
