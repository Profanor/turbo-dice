import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    API_BASE_URL:
      'ws://localhost:3000/instant-tournament',
  },
};

export default nextConfig;
