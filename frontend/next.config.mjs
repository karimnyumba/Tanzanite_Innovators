import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    URL://"http://127.0.0.1:8000",
    //"http://64.227.176.47:80",
  "https://sagecrop.com",

  },

});
