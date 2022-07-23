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

const askmeContract = {
	addressOrName: '0x5C27F10a285d7DDD06056e06AF5053e1A0cc8aC4',
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
				const questionReward = await askme_contract.questionFee(i)
				const isReplied = await askme_contract.isReplied(i)

				console.log(questionText)
				let item = {
					tokenId: i,
					reward: ethers.utils.formatUnits(questionReward),
					question: questionText,
					answer: answserText,
					isReplied: isReplied,
				}
				return item
			})
		)
		setNfts(items.reverse())
		console.log('NFT:', nfts)
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

	return (
		<div className="relative max-w-4xl mx-auto min-h-screen">
			{nfts.map((nft, i) => (
				<div className="bg-anon text-anon font-bold p-4">
					<div className="bg-black p-2">
						<p className="text-xl mb-4">Anon Card #{nft.tokenId}</p>
						<p className="text-base font-thin mb-4">_Anon &gt; {nft.question}</p>
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
