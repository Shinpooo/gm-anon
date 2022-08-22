/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['ipfs.infura.io', 'lens.infura-ipfs.io'],
	},
}

module.exports = nextConfig
