/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@turkish-name-finder/core',
    '@turkish-name-finder/data',
    '@turkish-name-finder/db'
  ],
  i18n: {
    locales: ['tr'],
    defaultLocale: 'tr'
  }
};

module.exports = nextConfig;
