/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable instrumentation to load tracing
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
