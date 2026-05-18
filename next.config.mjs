import createMDX from '@next/mdx';

const withMDX = createMDX({ extension: /\.mdx?$/ });

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  pageExtensions: ['ts', 'tsx', 'mdx'],
  reactStrictMode: true,
  // Allow /admin/ (and other public/* paths with trailing slash) to be served
  // without Next.js stripping the trailing slash and causing a 404.
  trailingSlash: true,
};

export default withMDX(nextConfig);
