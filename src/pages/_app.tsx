import 'tailwindcss/tailwind.css'
import { APP_NAME } from '@/lib/consts'
import '@rainbow-me/rainbowkit/styles.css'
import { chain, createClient, WagmiConfig, configureChains, defaultChains, useAccount } from 'wagmi'
import { Chain, getDefaultWallets, RainbowKitProvider, midnightTheme } from '@rainbow-me/rainbowkit'
import apollo from '@/lib/apollo'
import { ApolloProvider } from '@apollo/client'
import ConnectWallet from '../components/ConnectWallet'
import Link from 'next/link'
import { publicProvider } from 'wagmi/providers/public'


const { provider } = configureChains([chain.polygon], [publicProvider()])
const { chains } = configureChains([chain.polygon], [publicProvider()])
const { connectors } = getDefaultWallets({ appName: APP_NAME, chains })

const wagmiClient = createClient({ autoConnect: true, provider, connectors })

	// const wagmiClient = createClient({ autoConnect: true, connectors, provider })

const App = ({ Component, pageProps }) => {
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
					<div className="bg-black bg-cover min-h-screen">
						<div className="mx-auto w-full mb-4 py-16 max-w-5xl md:px-14">
							<div className="flex justify-between pt-8 sm:pt-0">
								<Link href="/">
									<h1 className="text-2xl md:text-4xl text-anon font-bold dark:text-white cursor-pointer">
										_CuriousCards
									</h1>
								</Link>
								<div className="flex gap-8">
									{true ? (
										<Link
											href="https://opensea.io/collection/anoncards0"
											rel="noreferrer"
											target="_blank"
										>
											<p className="text-2xl md:text-lg text-white font-bold dark:text-white cursor-pointer">
												NFTs
											</p>
										</Link>
									) : (
										<></>
									)}

									<Link
										href="/myquestions"
									>
										<p className="text-2xl md:text-lg text-white font-bold dark:text-white cursor-pointer">
											My Questions
										</p>
									</Link>

									<div className="my-auto">
										<ConnectWallet />
									</div>
								</div>
							</div>
						</div>
						<div className="text-anon flex justify-center mb-6">
							Beta: Anoncards is still super experimental, smart contracts may still change and your
							questions may also dissappear.
						</div>
						<Component {...pageProps} />
					</div>
				</ApolloProvider>
			</RainbowKitProvider>
		</WagmiConfig>
	)
}

export default App
