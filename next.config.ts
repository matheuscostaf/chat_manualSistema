import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['axios', 'https'],
  // Configurar timeout para funções serverless
  async rewrites() {
    return [];
  },
  webpack: (config, { isServer }) => {
    // Configurações para evitar nomes de arquivos muito longos
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          default: {
            ...config.optimization.splitChunks?.cacheGroups?.default,
            name: false,
          },
          vendor: {
            ...config.optimization.splitChunks?.cacheGroups?.vendor,
            name: false,
          },
        },
      },
    };
    
    // Configurar nomes de arquivos mais curtos
    if (!isServer) {
      config.output.filename = 'static/js/[name].[contenthash:8].js';
      config.output.chunkFilename = 'static/js/[name].[contenthash:8].chunk.js';
    }
    
    return config;
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
