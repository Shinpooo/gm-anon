/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			'mlp': ['mlp'],
			'mlp-bold': ['mlp-bold']
		},
		extend: {
			colors:{
				anon:"#FFFF1C"
			}
		},
	},
	plugins: [],
}
