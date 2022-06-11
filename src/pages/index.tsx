import { FC } from 'react'
import { APP_NAME } from '@/lib/consts'
import { BookOpenIcon, CodeIcon, ShareIcon } from '@heroicons/react/outline'
import ConnectWallet from '../components/ConnectWallet'
import LOAD_PROFILE from '@/queries/load-profile'
import { useQuery } from '@apollo/client'


const Home: FC = () => {
	// const { data, loading } = useQuery(LOAD_PROFILE, {
	// })
	// const profile = data.items
	// console.log(profile)

	return (
		<>
			<div className="relative flex flex-col justify-around min-h-screen py-4 dark items-top dark:bg-gray-900 sm:items-center sm:pt-0 max-w-4xl mx-auto px-6">
				{/* <div className="mx-auto w-full mb-10 py-16">
					<div className="flex justify-between pt-8 sm:pt-0">
						<h1 className="text-2xl md:text-4xl text-white font-bold dark:text-white">AmAnon</h1>
						<div className='my-auto'><ConnectWallet /></div>
					</div>
				</div> */}
				<div className='text-white text-4xl font-bold mb-8'>Askme helps connecting content creators to their community. <br></br>No signup, All you need is a lens profile. <br></br> Try it <a href="askmelens.vercel.app/profile/0xtestinprod.lens" className='underline'></a>here</div>
				{/* <div className='text-white text-2xl font-bold mb-8'>1 - As a content creator: Filter the mass amount of question by monetizing your time helping/answering others</div> */}
				{/* <div className='text-white text-2xl font-bold mb-8'>2 - As a community member, ask anything you want</div> */}
				<div className="mx-auto w-full">

					<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						{/* <div className="bg-gradient-to-r from-orange-600  to-violet-800 rounded-xl justify-center inline-block px-2 py-16 text-4xl text-center text-gray-200 font-semibold hover:bg-ape hover:text-transparent transtion duration-300 ease-out hover:ease-in hover:-translate-y-1 hover:scale-110 hover:bg-cover">
							<p className='text-4xl'>Building things 💻</p>
							<p className='text-lg'>Currently focused on web3 projects</p>
						</div>
						<div className="bg-gradient-to-r from-orange-600  to-violet-800 rounded-xl justify-center inline-block px-2 py-16 text-4xl text-center text-gray-200 font-semibold hover:bg-bojji hover:bg-cover hover:text-transparent transtion duration-300 ease-out hover:ease-in hover:-translate-y-1 hover:scale-110">
							<p className='text-4xl'>2D Animation ⚔️</p>
							<p className='text-lg'>Enjoyooor but want to get into it</p>
						</div>
						<div className="bg-gradient-to-r from-orange-600  to-violet-800 rounded-xl justify-center inline-block px-2 py-16 text-4xl text-center text-gray-200 font-semibold hover:bg-tsunade hover:bg-cover hover:text-transparent transtion duration-300 ease-out hover:ease-in hover:-translate-y-1 hover:scale-110">
							<p className='text-4xl'>Investing 💰</p>
							<p className='text-lg'>Mainly crypto research and stocks</p>
						</div>
						<div className="bg-gradient-to-r from-orange-600  to-violet-800 rounded-xl justify-center inline-block px-2 py-16 text-4xl text-center text-gray-200 font-semibold hover:bg-luffy hover:text-transparent transtion duration-300 ease-out hover:ease-in hover:-translate-y-1 hover:scale-110 hover:bg-cover">
							<p className='text-4xl'>Animes 📺</p>
							<p className='text-lg'>Naruto, SNK, HXH, KNY, Bojji</p>
						</div>
						<div className="bg-gradient-to-r from-orange-600  to-violet-800 rounded-xl justify-center inline-block px-2 py-16 text-4xl text-center text-gray-200 font-semibold hover:bg-kira hover:bg-cover hover:text-transparent transtion duration-300 ease-out hover:ease-in hover:-translate-y-1 hover:scale-110">
							<p className='text-4xl'>Research papers ✍️</p>
							<p className='text-lg'>Energy, Optimization, Data, ML</p>
						</div>

						<div className="bg-gradient-to-r from-orange-600  to-violet-800 rounded-xl justify-center inline-block px-2 py-16 text-4xl text-center text-gray-200 font-semibold hover:bg-umaru hover:text-transparent transtion duration-300 ease-out hover:ease-in hover:-translate-y-1 hover:scale-110 hover:bg-cover">
							<p className='text-4xl'>Gaming 🕹️</p>
							<p className='text-lg'>Dofus, Diablo2/PoE, TFT, Smash, league</p>
						</div>

						<div className="bg-gradient-to-r from-orange-600  to-violet-800 rounded-xl justify-center inline-block px-2 py-16 text-4xl text-center text-gray-200 font-semibold hover:bg-bojjifight hover:bg-cover hover:text-transparent transtion duration-300 ease-out hover:ease-in hover:-translate-y-1 hover:scale-110">
							<p className='text-4xl'>Gym 🏋️‍♂️</p>
							<p className='text-lg'>Push, pull, legs, street</p>
						</div> */}

						

						{/* <div className="bg-gradient-to-r from-orange-600  to-violet-800 rounded-xl justify-center inline-block px-2 py-16 text-4xl text-center text-gray-200 font-semibold hover:bg-livai hover:text-transparent transtion duration-300 ease-out hover:ease-in hover:-translate-y-1 hover:scale-110">
							<p className='text-4xl'>Design</p>
							<p className='text-lg'>100% newbie in 3D design and 2D animation</p>
						</div>

						<div className="bg-gradient-to-r from-orange-600  to-violet-800 rounded-xl justify-center inline-block px-2 py-16 text-4xl text-center text-gray-200 font-semibold hover:bg-livai hover:text-transparent transtion duration-300 ease-out hover:ease-in hover:-translate-y-1 hover:scale-110">
							<p className='text-4xl'>Quest</p>
							<p className='text-lg'>The whole purpose of this website</p>
						</div> */}
						
						{/* <div className='bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-2xl justify-center inline-block px-2 py-8 text-xl text-center text-black'>Investooor</div>
						<div className='bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-2xl justify-center inline-block px-2 py-8 text-xl text-center text-black'>Anime</div>
						<div className='bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-2xl justify-center inline-block px-2 py-8 text-xl text-center text-black'>Gaming</div>
						<div className='bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-2xl justify-center inline-block px-2 py-8 text-xl text-center text-black'>Sports</div>
						<div className='bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-2xl justify-center inline-block px-2 py-8 text-xl text-center text-black'>Traveling</div>
						<div className='bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-2xl justify-center inline-block px-2 py-8 text-xl text-center text-black'>Design</div>
						<div className='bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-2xl justify-center inline-block px-2 py-8 text-xl text-center text-black'>Engineering and Research</div> */}
					</div>

					{/* <div className="mt-8 overflow-hidden bg-white shadow dark:bg-gray-800 sm:rounded-lg">
						<div className="grid grid-cols-1 md:grid-cols-2">
							<div className="p-6">
								<div className="flex items-center">
									<BookOpenIcon className="w-8 h-8 text-gray-500" />
									
									<div className="ml-4 text-lg font-semibold leading-7">
										<a
											href="https://wagmi.sh"
											className="text-gray-900 underline dark:text-white"
										>
											Next.js Docs
										</a>
									</div>
								</div>

								<div className="ml-12">
									<div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
										Next.js gives you the best developer experience with all the features you need for
										production: hybrid static &amp; server rendering, TypeScript support, smart
										bundling, route pre-fetching, and more. No config needed.
									</div>
								</div>
							</div>

							<div className="p-6 border-t border-gray-200 dark:border-gray-700 md:border-t-0 md:border-l">
								<div className="flex items-center">
									<BookOpenIcon className="w-8 h-8 text-gray-500" />
									<div className="ml-4 text-lg font-semibold leading-7">
										<a href="https://laracasts.com" className="text-gray-900 underline dark:text-white">
											wagmi Docs
										</a>
									</div>
								</div>

								<div className="ml-12">
									<div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
										wagmi is a collection of React Hooks containing everything you need to start working
										with Ethereum. wagmi makes it easy to display ENS and balance information, sign
										messages, interact with contracts, and much more — all with caching, request
										deduplication, and persistence.
									</div>
								</div>
							</div>

							<div className="p-6 border-t border-gray-200 dark:border-gray-700">
								<div className="flex items-center">
									<BookOpenIcon className="w-8 h-8 text-gray-500" />
									<div className="ml-4 text-lg font-semibold leading-7">
										<a
											href="https://laravel-news.com/"
											className="text-gray-900 underline dark:text-white"
										>
											Tailwind Docs
										</a>
									</div>
								</div>

								<div className="ml-12">
									<div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
										Tailwind CSS is a highly customizable, low-level CSS framework that gives you all of
										the building blocks you need to build bespoke designs without any annoying
										opinionated styles you have to fight to override.
									</div>
								</div>
							</div>

							<div className="p-6 border-t border-gray-200 dark:border-gray-700 md:border-l">
								<div className="flex items-center">
									<CodeIcon className="w-8 h-8 text-gray-500" />
									<div className="ml-4 text-lg font-semibold leading-7 text-gray-900 dark:text-white">
										About this Template
									</div>
								</div>

								<div className="ml-12">
									<div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
										This starter kit is composed of{' '}
										<a href="https://nextjs.org" className="underline" target="_blank" rel="noreferrer">
											Next.js
										</a>{' '}
										and{' '}
										<a
											href="https://tailwindcss.com"
											className="underline"
											target="_blank"
											rel="noreferrer"
										>
											Tailwind CSS
										</a>
										, with{' '}
										<a
											href="https://rainbowkit.com"
											className="underline"
											target="_blank"
											rel="noreferrer"
										>
											RainbowKit
										</a>
										,{' '}
										<a href="https://ethers.org" className="underline" target="_blank" rel="noreferrer">
											ethers
										</a>{' '}
										&amp;{' '}
										<a href="https://wagmi.sh" className="underline" target="_blank" rel="noreferrer">
											wagmi
										</a>{' '}
										for all your web3 needs. It uses{' '}
										<a
											href="https://www.typescriptlang.org/"
											className="underline"
											target="_blank"
											rel="noreferrer"
										>
											Typescript
										</a>{' '}
										and an opinionated directory structure for maximum dev confy-ness. Enjoy!
									</div>
								</div>
							</div>
						</div>
					</div> */}
					
					{/* <div className="flex justify-center mt-4 sm:items-center sm:justify-between">
						<div className="text-sm text-center text-gray-500 sm:text-left">
							<div className="flex items-center">
								<ShareIcon className="w-5 h-5 -mt-px text-gray-400" />

								<a href="https://twitter.com/m1guelpf" className="ml-1 underline">
									Share
								</a>
							</div>
						</div>
					</div> */}
				</div>
			</div>
		</>
	)
}

export default Home
