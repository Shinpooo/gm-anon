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

const wagmiClient = createClient({ provider, connectors })

	// const wagmiClient = createClient({ autoConnect: true, connectors, provider })

const App = ({ Component, pageProps }) => {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider chains={chains} coolMode theme={midnightTheme()}>
				<ApolloProvider client={apollo}>
					<div className="bg-gradient-to-r from-yellow-200  to-orange-600 bg-cover min-h-screen">
						<div className="mx-auto w-full mb-4 py-16 max-w-5xl">
							<div className="flex justify-between pt-8 sm:pt-0">
								<Link href="/">
									<h1 className="text-2xl md:text-4xl text-white font-bold dark:text-white cursor-pointer">
										🙋 CuriousMonke
									</h1>
								</Link>
								<div className="flex gap-8">
									{
										true ? <Link href="/">
											<p className="text-2xl md:text-lg text-white font-bold dark:text-white cursor-pointer">
												My Profile
											</p>
										</Link> : <></>
									}
									
									<div className="my-auto">
										<ConnectWallet />
									</div>
								</div>
							</div>
						</div>
						<Component {...pageProps} />
					</div>
				</ApolloProvider>
			</RainbowKitProvider>
		</WagmiConfig>
	)
}

export default App
