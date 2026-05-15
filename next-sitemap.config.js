/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://phillipsben.com',
  generateRobotsTxt: true,
  exclude: ['/resume/print', '/404'],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/', disallow: ['/resume/print'] }],
  },
};
