import 'tailwindcss/tailwind.css'
import { APP_NAME } from '@/lib/consts'
import '@rainbow-me/rainbowkit/styles.css'
import { chain, createClient, WagmiConfig } from 'wagmi'
import { Chain, apiProvider, configureChains, getDefaultWallets, RainbowKitProvider, midnightTheme } from '@rainbow-me/rainbowkit'
import apollo from '@/lib/apollo'
import { ApolloProvider } from '@apollo/client'
import ConnectWallet from '../components/ConnectWallet'

const { chains, provider } = configureChains(
	[chain.polygon],
	[apiProvider.infura(process.env.NEXT_PUBLIC_INFURA_ID), apiProvider.fallback()]
)

const { connectors } = getDefaultWallets({ appName: APP_NAME, chains })
const wagmiClient = createClient({ autoConnect: true, connectors, provider })

const App = ({ Component, pageProps }) => {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider chains={chains} coolMode theme={midnightTheme()}>
				<ApolloProvider client={apollo}>
						<div className="bg-gradient-to-r from-yellow-200  to-orange-600 bg-cover min-h-screen">
							<div className="mx-auto w-full mb-10 py-16 max-w-4xl">
								<div className="flex justify-between pt-8 sm:pt-0">
									<h1 className="text-2xl md:text-4xl text-white font-bold dark:text-white">🙋 Askme</h1>
									<div className='my-auto'><ConnectWallet /></div>
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
