import { gql, useQuery } from '@apollo/client'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState, FC } from 'react'
import consoleLog from '../lib/consoleLog'
import Image from 'next/image'
import matic from '../../public/images/matic.svg'
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
import anoncards_abi from '../abis/AnonCards.json'
import { ethers } from 'ethers'
import { PROXY_ADDRESS } from '@/lib/consts'
import ReactLoading from 'react-loading'

const askmeContract = {
	addressOrName: PROXY_ADDRESS,
	contractInterface: anoncards_abi,
}

function QuestionList(props) {
	console.log(props)
	const tokenids = props.ids
	const name = props.name
	const owner = props.owner
	console.log(tokenids)
	const { address } = useAccount()

	const provider = useProvider()
	const { data: signer } = useSigner()

	const [questionsId, setQuestionsId] = useState<any>([])
	const [questionsText, setQuestionsText] = useState<any>([])
	const [answersText, setAnswersText] = useState<any>([])
	const [nfts, setNfts] = useState<any>([])
	const [displayedNfts, setDisplayedNfts] = useState<any>([])
	const [isFetching, setIsFetching] = useState<boolean>(false)
	const [loadingState, setLoadingState] = useState<boolean>(true)


	useEffect(() => {
		window.addEventListener('scroll', handleScroll)
		loadText()
	}, [])

	const handleScroll = () => {
		if (
			Math.ceil(window.innerHeight + document.documentElement.scrollTop) <
				document.documentElement.offsetHeight - 500 ||
			isFetching
		)
			return
		setIsFetching(true)
	}

	const fetchData = async () => {
		setTimeout(async () => {
			const copy = [...displayedNfts]
			let length = copy.length
			const slicedArray = nfts.slice(0, length + 10)
			setDisplayedNfts(slicedArray)
		}, 1000)
	}

	useEffect(() => {
		if (!isFetching) return
		fetchMoreListItems()
	}, [isFetching])

	const fetchMoreListItems = () => {
		fetchData()
		setIsFetching(false)
	}


	// const { data: questiontext, fetchNextPage } = useContractInfiniteReads({
	// 	cacheKey: 'questioncache',
	// 	...paginatedIndexesConfig(
	// 		index => ({
	// 			...askmeContract,
	// 			functionName: 'question',
	// 			args: [index],
	// 		}),
	// 		{ start: 1, perPage: 10, direction: 'increment' }
	// 	),
	// 	onSuccess(questiontext) {
	// 		// console.log('cache', mlootAttributes)
	// 		console.log('Success!!! ', questiontext)
	// 		let addquestion = questiontext.pages[0][1]
	// 		setQuestionsText([...questionsText, addquestion])
	// 	},
	// 	onError(error) {
	// 		console.log('error', error)
	// 	},
	// 	onSettled(data) {
	// 		console.log('Settled', data)
	// 	},
	// })
	useEffect(() => {
		loadText()
	}, [questionsId, tokenids])
	async function loadText() {
		const askme_contract = new ethers.Contract(
			askmeContract.addressOrName,
			askmeContract.contractInterface,
			provider
		)
		const items = await Promise.all(
			tokenids.map(async i => {
				console.log('index', i)
				const questionText = await askme_contract.question(i)
				const answserText = await askme_contract.answer(i)
				const asker = await askme_contract.asker(i)
				const questionReward = await askme_contract.questionFee(i)
				const isReplied = await askme_contract.isReplied(i)
				let redeemDuration = await askme_contract.getRedeemDuration(i)
				console.log(redeemDuration)
				const redeemDurationStr = secondsToDhms(redeemDuration)
				let item = {
					tokenId: i,
					asker: asker.substring(0, 6),
					reward: ethers.utils.formatUnits(questionReward),
					question: questionText,
					answer: answserText,
					isReplied: isReplied,
					duration: redeemDurationStr
				}
				return item
			})
		)
		let items_reversed = items.reverse()
		setNfts(items_reversed)
		setDisplayedNfts(items_reversed.slice(0, 10))
		setLoadingState(false)
		console.log('NFT:', nfts)
	}

	function secondsToDhms(seconds) {
		if (seconds == 0) {
			return 'Redeemable'
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
	// const { data: answertext, fetchNextPage: nextpg } = useContractInfiniteReads({
	// 	cacheKey: 'answercache',
	// 	...paginatedIndexesConfig(
	// 		index => ({
	// 			...askmeContract,
	// 			functionName: 'answer',
	// 			args: [index],
	// 		}),
	// 		{ start: 1, perPage: 10, direction: 'increment' }
	// 	),
	// 	onSuccess(answertext) {
	// 		// console.log('cache', mlootAttributes)
	// 		console.log('Success!! ', answertext)
	// 		let addanswer = answertext.pages[0][1]
	// 		setAnswersText([...answersText, addanswer])
	// 	},
	// 	onError(error) {
	// 		console.log('error', error)
	// 	},
	// })

	// const {
	// 	data: askdata,
	// 	isLoading: askLoading,
	// 	write: askquestion,
	// } = useContractWrite({
	// 	addressOrName: '0x076874Cf62b56BA16f399af6f877C01006201CBB',
	// 	contractInterface: anoncards_abi,
	// 	functionName: 'reply',
	// 	args: [replyText, replyId],
	// 	onSuccess(askquestion) {},
	// })

	async function updateReply(nft_index, replyText) {
		let newArr = [...nfts] // copying the old datas array
		newArr[nft_index].replyText = replyText
		setNfts(newArr)
	}

	async function reply(nft) {
		const askme_contract = new ethers.Contract(askmeContract.addressOrName, askmeContract.contractInterface, signer)
		let transaction = await askme_contract.reply(nft.replyText, nft.tokenId)
		await transaction.wait()
	}

	    if (loadingState && !nfts.length)
			return (
				<div className="flex flex-col items-center justify-center mt-20">
					<h1 className="px-20 py-2 text-3xl text-anon font-bold">Loading your questions...</h1>
					<ReactLoading type="spin" height={'8%'} width={'8%'} />
				</div>
			)

	return (
		<div className="relative max-w-4xl mx-auto min-h-screen">
			{displayedNfts.map((nft, i) => (
				<div key={i} className="bg-anon text-anon font-bold p-4">
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
						<p className="text-base font-thin mb-4 break-all">_{nft.asker} &gt; {nft.question}</p>
						{nft.isReplied ? (
							<p className="text-base font-thin">
								_{name} &gt; {nft.answer}
							</p>
						) : owner === address ? (
							<>
								<input
									placeholder={'Reply here'}
									className="w-full enabled:border-black focus:border-transparent text-base placeholder-anon bg-black placeholder-opacity-50 font-mlp-thin pb-12 rounded-0 mb-2"
									// onChange={e => setQuestionText(e.target.value)}
									onChange={e => updateReply(i, e.target.value)}
									// value={}
								/>
								<button
									className="bg-black mx-auto px-4 py-2 rounded-0 flex gap-2 font-bold hover:scale-110 transition duration-300 border-anon border-2"
									onClick={() => reply(nft)}
								>
									Reply to earn {nft.reward}
									<Image src={matic} height="24px" width="24px"></Image>
								</button>
							</>
						) : (
							<div className="font-thin">_{name} &gt; Not replied yet</div>
						)}
					</div>
				</div>
			))}
		</div>
	)
}

export default QuestionList
