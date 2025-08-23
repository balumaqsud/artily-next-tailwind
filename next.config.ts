import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
    REACT_APP_API_WS: process.env.REACT_APP_API_WS,
  },
};

const { i18n } = require("./next-i18next.config");
nextConfig.i18n = i18n;

export default nextConfig;
