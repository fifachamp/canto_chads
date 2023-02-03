/** @type {import('next').NextConfig} */
require('dotenv').config({path: '../.env'})

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    CHAIN_ID: 5,
    ALCHEMY_ID: process.env.ALCHEMY_ID,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    TARGET_CHAIN: process.env.TARGET_CHAIN
  }
}

module.exports = nextConfig
