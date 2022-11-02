/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ['infura-ipfs.io', 'saisi-nft-marketplace.infura-ipfs.io'],
	},
};

module.exports = nextConfig;
