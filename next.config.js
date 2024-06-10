/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      // Add file-loader for handling .node binary files
      config.module.rules.push({
        test: /\.node$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'static/assets/',
            publicPath: '/_next/static/assets/'
          }
        }
      });
  
      return config;
    },
  };
  
  module.exports = nextConfig;
  