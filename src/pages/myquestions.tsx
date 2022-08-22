/* pages/my-assets.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import {
	useContractRead,
	useAccount,
	useContractWrite,
	useContractReads,
	useContractInfiniteReads,
	paginatedIndexesConfig,
	useProvider,
	useSigner,
} from 'wagmi'
import ReactLoading from 'react-loading'

import anoncards_abi from '../abis/AnonCards.json'
import { PROXY_ADDRESS } from '@/lib/consts'

// import Staking from '../artifacts/contracts/NFTstaking.sol/NFTstaking.json'
const askmeContract = {
	addressOrName: PROXY_ADDRESS,
	contractInterface: anoncards_abi,
}

export default function MyAssets() {
	const [nfts, setNfts] = useState([])
	const [loadingState, setLoadingState] = useState(true)
	const { address } = useAccount()

	const provider = useProvider()
	const { data: signer } = useSigner()

	useEffect(() => {
		loadNFTs()
	}, [])

	async function loadNFTs() {
		const askme_contract = new ethers.Contract(
			askmeContract.addressOrName,
			askmeContract.contractInterface,
			provider
		)

		// const marketContract = new ethers.Contract(marketaddress, Market.abi, provider)
		// const stakingContract = new ethers.Contract(stakingaddress, Staking.abi, provider)
		const tokenids = await askme_contract.walletOfUser(address)
		// const onSaleToken = await marketContract.getOnSaleTokenIdsOfAddress(account)
		// const stakedTokenIds = await stakingContract.getStakedTokenIdsofAddress(account)
		// const total_rewards = await stakingContract.getUserRewards(account)
		// setTotalRewards(ethers.utils.formatUnits(total_rewards, 'ether'))
		// const onSaleTokenIds = onSaleToken.tokenIds.map(i => i.toNumber())
		const items = await Promise.all(
			tokenids.map(async i => {
				const questionText = await askme_contract.question(i)
				const answerText = await askme_contract.answer(i)
				let asker = await askme_contract.asker(i)
				let replier_id = await askme_contract.replierProfileId(i)
				replier_id = replier_id.toNumber()
				const replier_handle = await askme_contract.getHandle(replier_id)
				const questionReward = await askme_contract.questionFee(i)
                let question_fee = await askme_contract.questionFee(i)
                question_fee = ethers.utils.formatUnits(question_fee)
				const isReplied = await askme_contract.isReplied(i)
				let redeemDuration = await askme_contract.getRedeemDuration(i)
				console.log(redeemDuration)
				const redeemDurationStr = secondsToDhms(redeemDuration)

				let item = {
					tokenId: i.toNumber(),
					asker: asker.substring(0,6),
					reward: ethers.utils.formatUnits(questionReward),
					replier: replier_handle,
					question: questionText,
					answer: answerText,
					isReplied: isReplied,
					duration: redeemDurationStr,
                    fee: question_fee
				}
				return item
			})
		)

		setNfts(items)

		console.log(items)
		setLoadingState(false)

		// console.log("test")
	}

	async function redeem(nft) {
		const askme_contract = new ethers.Contract(askmeContract.addressOrName, askmeContract.contractInterface, signer)
		let transaction = await askme_contract.redeem(nft.tokenId)
		await transaction.wait()
	}

	function secondsToDhms(seconds) {
		if (seconds == 0) {
			return "0 D 0H 0m"
		} else {
			seconds = Number(seconds)
			let d = Math.floor(seconds / (3600 * 24))
			let h = Math.floor((seconds % (3600 * 24)) / 3600)
			let m = Math.floor((seconds % 3600) / 60)
			let s = Math.floor(seconds % 60)

			let dDisplay = d > 0 ? d + (d == 1 ? ' D ' : ' D ') : ''
			let hDisplay = h > 0 ? h + (h == 1 ? ' H ' : ' H ') : ''
			let mDisplay = m > 0 ? m + (m == 1 ? ' m ' : ' m ') : ''
			// let sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : ''
			return dDisplay + hDisplay + mDisplay //+ sDisplay
		}
	}

	if (!loadingState && !nfts.length)
		return <h1 className="px-20 py-10 text-3xl text-center text-anon font-bold">No questions asked.</h1>
	if (loadingState && !nfts.length)
		return (
			<div className="flex flex-col items-center justify-center mt-20">
				<h1 className="px-20 py-2 text-3xl text-anon font-bold">Loading your questions...</h1>
				<ReactLoading type="spin" height={'8%'} width={'8%'} />
			</div>
		)
	if ( !signer ) return <h1 className="px-20 py-10 text-3xl text-center text-anon font-bold">Connect your wallet first !</h1>
	return (
		<div className="flex flex-col items-center justify-center max-w-6xl mx-auto pb-8 md:pb-24">
			{/* <div className="grid grid-cols-1 gap-10 pt-4 sm:grid-cols-2 lg:grid-cols-5"> */}
			<div className="grid grid-cols-1 gap-2 pt-4 md:grid-cols-2">
				{nfts.map((nft, i) => (
					// <Link key={i} href={`/details/${nft.tokenId}`}>
					//<a >
					<div key={i} className="border border-anon md:col-span-2 text-anon">
							{/* <svg
								// width="500"
								// height="500"
								xmlns="http://www.w3.org/2000/svg"
								xmlnsXlink="http://www.w3.org/1999/xlink"
								preserveAspectRatio="xMinYMin meet"
							>
								<rect width="100%" height="100%" fill="black" />
								<defs>
									<path
										id="path1"
										d="M10,30 H490 M10,60 H490 M10,90 H490 M10,120 H490 M10,150 H490 M10,180 H490"
									></path>
									<path
										id="path2"
										d="M10,240 H490 M10,270 H490 M10,300 H490 M10,330 H490 M10,360 H490 M10,390 H490"
									></path>
								</defs>
								<use xlinkHref="#path1" x="0" y="35" stroke="transparent" strokeWidth="1" />
								<use xlinkHref="#path2" x="0" y="35" stroke="transparent" strokeWidth="1" />
								<text transform="translate(0,35)" fill="yellow" fontSize="12" fontFamily="monospace">
									<textPath xlinkHref="#path1">
										{nft.asker}: {nft.question}
									</textPath>
									<textPath xlinkHref="#path2">
										{nft.replier} : {nft.answer}
									</textPath>
								</text>
							</svg> */}
						<div className="bg-black p-2">
							<div className="flex justify-between">
								<p className="text-xl mb-4">Curious Card #{nft.tokenId}</p>
								{!nft.isReplied ? (
									<p className="text-base font-thin">
										<p className="text-xl mb-4">{nft.duration}</p>
									</p>
								) : (
									<></>
								)}
							</div>
							<p className="text-base font-thin mb-4 break-all">{nft.asker} &gt; {nft.question}</p>
							{nft.isReplied ? (
								<p className="text-base font-thin">
									_{nft.replier} &gt; {nft.answer}
								</p>):(
								<div className="font-thin">_{nft.replier} &gt; Not replied yet</div>
							)}
							{!nft.isReplied ? (
								<div className="p-4 bg-black">
									{/* <p className="mb-2 text-sm text-white font-mlp">{nft.id}</p> */}

									<button
										className="w-full py-2 mt-2 bg-black text-anon hover:bg-anon hover:text-black border border-anon hover:border-yellow font-mlp-bold"
										onClick={() => redeem(nft)}
									>
										Redeem in {nft.duration} and get back {nft.fee} Matic
									</button>
								</div>
							) : (
								<></>
							)}
						</div>
					</div>))
				}
			</div>
		</div>
	)
	
}
