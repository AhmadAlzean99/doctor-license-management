import path from 'path';
import os from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { dev }) {
    if (dev) {
      config.cache = {
        type: 'filesystem',
        cacheDirectory: path.join(os.tmpdir(), 'next-doc-license-cache'),
      };
    }
    return config;
  },
};

export default nextConfig;
