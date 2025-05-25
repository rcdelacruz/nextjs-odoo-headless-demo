/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    ODOO_BASE_URL: process.env.ODOO_BASE_URL,
    ODOO_DATABASE: process.env.ODOO_DATABASE,
    ODOO_USERNAME: process.env.ODOO_USERNAME,
    ODOO_PASSWORD: process.env.ODOO_PASSWORD,
  },
};

export default nextConfig;