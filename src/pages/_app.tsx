import 'tailwindcss/tailwind.css'
import { APP_NAME } from '@/lib/consts'
import '@rainbow-me/rainbowkit/styles.css'
import { chain, createClient, WagmiConfig, configureChains, defaultChains, useAccount, useSigner } from 'wagmi'
import { Chain, getDefaultWallets, RainbowKitProvider, midnightTheme } from '@rainbow-me/rainbowkit'
import apollo from '@/lib/apollo'
import { ApolloProvider } from '@apollo/client'
import ConnectWallet from '../components/ConnectWallet'
import Link from 'next/link'
import { publicProvider } from 'wagmi/providers/public'
import { useEffect, useState } from 'react'

const { provider } = configureChains([chain.polygon], [publicProvider()])
const { chains } = configureChains([chain.polygon], [publicProvider()])
const { connectors } = getDefaultWallets({ appName: APP_NAME, chains })

const wagmiClient = createClient({ autoConnect: true, provider, connectors })

// const wagmiClient = createClient({ autoConnect: true, connectors, provider })

const App = ({ Component, pageProps }) => {
	const [hidden, setHidden] = useState('hidden')
	function changeHidden() {
		if (hidden) {
			setHidden('')
		} else {
			setHidden('hidden')
		}
	}

	//   useEffect(() => {
	// 		/**
	// 		 * Alert if clicked on outside of element
	// 		 */
	// 		function handleClickOutside(event) {
	// 			setHidden('hidden')
	// 		}
	// 		// Bind the event listener
	// 		document.addEventListener('mousedown', handleClickOutside)

	//   }, [hidden])

	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider
				chains={chains}
				coolMode
				theme={midnightTheme({
					accentColor: '#FFFF1C',
					accentColorForeground: 'black',
					borderRadius: 'small',
				})}
			>
				<ApolloProvider client={apollo}>
					{/* <div className="bg-gradient-to-r from-yellow-200  to-orange-600 bg-cover min-h-screen"> */}
					<div className="bg-black bg-cover min-h-screen px-4 flex flex-col gap-12">
						<div className="mx-auto w-full mb-4 md:py-16 py-6 max-w-5xl md:px-14">
							<div className="flex md:pt-8 sm:pt-0 justify-between items-center text-center md:pb-8">
								<Link href="/">
									<h1 className="text-2xl md:text-4xl text-anon font-bold dark:text-white cursor-pointer">
										CuriousCards
									</h1>
								</Link>
								<div className="hidden gap-8 text-center align-middle justify-center items-center mx-12 md:mx-0  md:flex">
									<a
										href="https://opensea.io/collection/curiouscards0"
										rel="noreferrer"
										target="_blank"
									>
										<p className="text-sm md:text-lg text-white font-bold dark:text-white cursor-pointer">
											Opensea
										</p>
									</a>

									<Link href="/myquestions">
										<p className="text-sm md:text-lg text-white font-bold dark:text-white cursor-pointer">
											My Questions
										</p>
									</Link>

									<div className="my-auto">
										<ConnectWallet />
									</div>
								</div>
								<div className="md:hidden">
									<button onClick={changeHidden}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="w-6 h-6"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M4 6h16M4 12h16M4 18h16"
												stroke="white"
											/>
										</svg>
									</button>
								</div>
							</div>

							<div className={hidden + ' md:hidden flex flex-col gap-4 items-center'}>
								<div className="my-auto mt-8">
									<ConnectWallet />
								</div>
								<Link
									href="https://opensea.io/collection/curiouscards0"
									rel="noreferrer"
									target="_blank"
								>
									<p className="text-sm md:text-lg text-white font-bold dark:text-white cursor-pointer">
										Opensea
									</p>
								</Link>

								<Link href="/myquestions">
									<p className="text-sm md:text-lg text-white font-bold dark:text-white cursor-pointer">
										My Questions
									</p>
								</Link>
							</div>
						</div>

						<Component {...pageProps} />
						<div className="text-anon flex justify-center py-6 font-thin">
							Beta: Anoncards is still experimental, exercise caution when interacting with smart
							contracts.
						</div>
					</div>
				</ApolloProvider>
			</RainbowKitProvider>
		</WagmiConfig>
	)
}

export default App
