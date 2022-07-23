import { gql, useQuery } from '@apollo/client'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import consoleLog from '../lib/consoleLog'
import Image from 'next/image'
import matic from '../../public/images/matic.svg'
import QuestionList from './QuestionList'

import {
	useContractRead,
	useAccount,
	useContractWrite,
	useContractReads,
	useContractInfiniteReads,
	paginatedIndexesConfig,
	useSigner,
	useProvider
} from 'wagmi'
import anoncards_abi from '../abis/AnonCards.json'
import { ethers } from 'ethers'

export const PROFILE_QUERY = gql`
	query Profile($request: SingleProfileQueryRequest!) {
		profile(request: $request) {
			id
			name
			bio
			picture {
				... on NftImage {
					uri
				}
				... on MediaSet {
					original {
						url
					}
				}
			}
			handle
			coverPicture {
				... on NftImage {
					uri
				}
				... on MediaSet {
					original {
						url
					}
				}
			}
			ownedBy
			stats {
				totalFollowers
				totalFollowing
				totalPosts
				totalPublications
				totalCollects
			}
		}
	}
`
const askmeContract = {
	addressOrName: '0x5C27F10a285d7DDD06056e06AF5053e1A0cc8aC4',
	contractInterface: anoncards_abi,
}

const ViewProfile: NextPage = () => {
	const [newAskFee, setNewAskFee] = useState<string>('0')
	const [questionText, setQuestionText] = useState<string>('')
	const [askFee, setAskFee] = useState<any>(0)
	const [rewards, setRewards] = useState<any>(0)
	const [isActive, setIsActive] = useState<any>(false)
	const [profileId, setProfileId] = useState<any>(0)
	const [amountReplied, setAmountReplied] = useState<any>(0)
	const [questionsId, setQuestionsId] = useState<any>([])
	const [questionsText, setQuestionsText] = useState<any>([])
	const [answersText, setAnswersText] = useState<any>([])
	const {
		query: { username, type },
	} = useRouter()
	const { address, connector } = useAccount()
	const { data: signer } = useSigner()
	const provider = useProvider()


	//   const [feedType, setFeedType] = useState<string>(
	//     type && ['post', 'comment', 'mirror', 'nft'].includes(type as string)
	//       ? type?.toString().toUpperCase()
	//       : 'POST'
	//   )
	const { data, loading, error } = useQuery(PROFILE_QUERY, {
		variables: { request: { handle: username }, who: null },
		skip: !username,
		onCompleted(data) {
			consoleLog('Query', '#8b5cf6', `Fetched profile details Profile:${data?.profile?.id}`)
			setProfileId(parseInt(data?.profile.id.toString().slice(2), 16))
			
		},
	})
	let intId = parseInt(data?.profile.id.toString().slice(2), 16)
	// console.log("int id", intId)

	useEffect(() => {
		loadProfile()
	}, [profileId])
	async function loadProfile(){
		const askme_contract = new ethers.Contract(askmeContract.addressOrName,askmeContract.contractInterface,provider)
		const is_active = await askme_contract.isActive(profileId)
		const ask_fee = await askme_contract.askFee(profileId)
		const questions_id = await askme_contract.fetchQuestionsId(profileId)
		const rewards = await askme_contract.rewards(profileId)
		const amout_replied = await askme_contract.amountReplied(profileId)
		setIsActive(is_active)
		setAskFee(ethers.utils.formatUnits(ask_fee))
		setQuestionsId(questions_id.map(i => i.toNumber()))
		setRewards(ethers.utils.formatUnits(rewards))
		setAmountReplied(amout_replied.toNumber())
	}
	// const {
	// 	data: reads,
	// 	isError,
	// 	isLoading,
	// } = useContractReads({
	// 	contracts: [
	// 		{
	// 			...askmeContract,
	// 			functionName: 'isActive',
	// 			args: [profileId],
	// 		},
	// 		{
	// 			...askmeContract,
	// 			functionName: 'askFee',
	// 			args: [profileId],
	// 		},
	// 		{
	// 			...askmeContract,
	// 			functionName: 'fetchQuestionsId',
	// 			args: [profileId],
	// 		},
	// 		{
	// 			...askmeContract,
	// 			functionName: 'rewards',
	// 			args: [profileId],
	// 		},
	// 		{
	// 			...askmeContract,
	// 			functionName: 'amountReplied',
	// 			args: [profileId],
	// 		},
	// 	],
	// 	onSuccess(reads) {
	// 		setIsActive(reads[0])
	// 		setAskFee(ethers.utils.formatUnits(reads[1]))
	// 		setQuestionsId(reads[2].map(i => i.toNumber()))
	// 		setRewards(ethers.utils.formatUnits(reads[3]))
	// 		setAmountReplied(reads[4].toNumber())
	// 		consoleLog('Query', '#8b5cf6', `Fetched profile Questions Id:${questionsId}`)

	// 		console.log(reads)
	// 	},
	// })

	// 	const { data: questiontext, fetchNextPage } = useContractInfiniteReads({
	// 		cacheKey: 'questioncache',
	// 		...paginatedIndexesConfig(
	// 			index => ({
	// 				...askmeContract,
	// 				functionName: 'question',
	// 				args: [index],
	// 			}),
	// 			{ start: 1, perPage: 10, direction: 'increment' }
	// 		),
	// 		onSuccess(questiontext) {
	// 			// console.log('cache', mlootAttributes)
	// 			console.log('Success!!! ', questiontext)
	// 			let addquestion = questiontext.pages[0][1]
	// 			setQuestionsText([...questionsText, addquestion])
	// 		},
	// 		onError(error) {
	// 			console.log('error', error)
	// 		},
	// 	})
	

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
	
	// console.log(reads) 
	// console.log(reads[0], reads[1])
	// console.log(reads[0], ethers.utils.parseEther(ethers.utils.formatUnits(reads[1])))
	// if (isLoading || !reads) {
	// const active = reads[0]
	// const askfees = ethers.utils.formatUnits(reads[1])
	// console.log(askfees, "askfees")
	// }

	// const isActive = useContractRead(
	// 	{
	// 		addressOrName: '0x12a5D5062b1Be8949cDD6195e3A916A2d8e76589',
	// 		contractInterface: anoncards_abi,
	// 	},
	// 	'isActive',
	// 	{
	// 		args: data?.profile.id,
	// 		onSuccess(isActive) {
	// 			console.log('Success', isActive)
	// 		},
	// 	}
	// )

	const { data: updateprofile, write: updatefee } = useContractWrite({
		addressOrName: '0x5C27F10a285d7DDD06056e06AF5053e1A0cc8aC4',
		contractInterface: anoncards_abi,
		functionName: 'updateProfile',
		args: ['true', ethers.utils.parseUnits(newAskFee, 'ether'), intId],
		onSuccess(updateProfile) {
			// console.log('Success', updateProfile)
		},
	})

	// console.log("reads", reads)

	// const { data: askfee } = useContractRead(
	// 	{
	// 		addressOrName: '0x12a5D5062b1Be8949cDD6195e3A916A2d8e76589',
	// 		contractInterface: anoncards_abi,
	// 		functionName: 'askFee',
	// 		args: ['true', ethers.utils.parseUnits(newAskFee, 'ether'), data?.profile?.id],
	// 		onSuccess(askfee) {
	// 			console.log('Success', ethers.utils.formatUnits(askfee.toString(), 18))
	// 		},
	// 	}
	// )

	const {
		data: askdata,
		isLoading: askLoading,
		write: askquestion,
	} = useContractWrite({
		addressOrName: '0x5C27F10a285d7DDD06056e06AF5053e1A0cc8aC4',
		contractInterface: anoncards_abi,
		functionName: 'mint',
		args: [questionText, profileId],
		onSuccess(askquestion) {
			// console.log('Success', askquestion)
		},
		overrides: {
			value: ethers.utils.parseEther(askFee.toString()),
		},
	})

	// useEffect(() => {
	// 	// Update the document title using the browser API
	// 	loadApeData()
	// })

	// async function loadApeData(){

	// }
	async function claimRewards() {
		const askme_contract = new ethers.Contract(askmeContract.addressOrName, askmeContract.contractInterface, signer)
		let transaction = await askme_contract.claimRewards(profileId)
		await transaction.wait()
	}

	//   if (error) return <Custom500 />
	if (loading || !data) return <></>
	//   if (data?.profiles?.items?.length === 0) return <Custom404 />

	const profile = data?.profile
	// console.log(profile?.ownedBy)
	return (
		<div className="relative max-w-4xl mx-auto min-h-screen text-anon">
			{profile?.coverPicture ? (
				<Image src={profile?.coverPicture?.original?.url} height="300px" width="900px"></Image>
			) : (
				<div className="bg-anon h-72 w-full"></div>
			)}
			<div className="absolute bottom-100 inset-x-0 top-48  flex mx-auto justify-center">
				<div className="rounded-full overflow-hidden border-anon border-4">
					{profile?.picture ? (
						<Image src={profile?.picture?.original?.url} height="200px" width="200px"></Image>
					) : (
						<></>
					)}
				</div>
			</div>
			<div className="bg-black w-full mx-auto flex justify-center pt-32 pb-4 flex-col text-center rounded-md">
				<p className="relative bottom-0 inset-x-0 top-0  flex mx-auto justify-center"></p>
				<div className="flex mx-auto">
					<p className="text-4xl font-bold">{profile?.name} </p>
					{isActive ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clipRule="evenodd"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clipRule="evenodd"
							/>
						</svg>
					)}
				</div>

				<p>@{profile?.handle}</p>
				<div className="flex justify-center gap-4 mb-10 mt-4">
					<div className="flex flex-col justify-center">
						<p className="text-xl">{profile?.stats?.totalFollowers}</p>
						<p>Followers </p>
					</div>
					<div className="flex flex-col justify-center">
						<p className="text-xl">{profile?.stats?.totalFollowing}</p>
						<p>Following </p>
					</div>
					<div className="flex flex-col justify-center">
						<p className="text-xl">{amountReplied}</p>
						<p>Answers </p>
					</div>
					{/* <div className="flex flex-col justify-center">
						<p className="text-xl">{isActive.toString()}</p>
						<p>is Active </p>
					</div> */}
					{profile?.ownedBy === address ? (
						<div className="flex flex-col justify-center">
							<p className="text-xl">{rewards} MATIC</p>
							<button className="bg-anon text-black" onClick={claimRewards}>
								Claim{' '}
							</button>
						</div>
					) : (
						<></>
					)}
					{/* {isActive ? (
						<div className="flex flex-col justify-center">
							<p className="text-xl">{askFee} <Image src={matic} height="24px" width="24px"></Image></p>
							<p>Fees </p>
							
						</div>
					) : (
						<></>
					)} */}
				</div>
				{profile?.ownedBy === address ? (
					<div className="flex justify-center">
						<div className="flex flex-col">
							<p className="text-sm">Ask fee (MATIC):</p>
							<input
								placeholder={'1'}
								className="mx-auto enabled:border-yellow-400 p-2 text-base placeholder-black bg-gray-100 placeholder-opacity-50 font-mlp-thin rounded-0 mb-2 text-black"
								onChange={e => setNewAskFee(e.target.value)}
								// value={}
							/>
							<button
								className="bg-anon text-black mx-auto px-4 py-2 items-center rounded-0 flex gap-2 font-bold hover:scale-110 transition duration-300"
								onClick={() => updatefee()}
							>
								{isActive ? <>Update Fee</> : <>Activate profile</>}
							</button>
						</div>
					</div>
				) : isActive ? (
					<>
						<input
							maxLength={400}
							placeholder={'Ask me anything'}
							className="mx-10 enabled:border-anon p-2 text-base placeholder-anon bg-black placeholder-opacity-50 font-mlp-thin pb-12 rounded-0 mb-2 border-anon border-2 break-all overflow-wrap"
							onChange={e => setQuestionText(e.target.value)}
							// value={}
						/>
						<div className="flex justify-end mx-10">{questionText.length}/400</div>
						<button
							className="bg-black mx-auto px-4 py-2 rounded-0 flex gap-2 font-bold hover:scale-110 transition duration-300 border-anon border-2"
							onClick={() => askquestion()}
						>
							Ask for {askFee}
							<Image src={matic} height="24px" width="24px"></Image>
						</button>
						<p className="mt-12 font-light">
							Payment is locked in the smart contract until you get a reply. <br></br>Didn't get a reply?
							You can redeem your question NFT after 7 days and get back your payment.
						</p>
					</>
				) : (
					<>This account is inactive.</>
				)}
			</div>

			<QuestionList ids={questionsId} name={profile?.name} owner={profile?.ownedBy}></QuestionList>
			{/* {
				questionsText.map(question => (
					<>
						{question}
					</>))
			} */}

			{/* {profile?.name ? (
        <SEO title={`${profile?.name} (@${profile?.handle}) • Lenster`} />
      ) : (
        <SEO title={`@${profile?.handle} • Lenster`} />
      )}
      <Cover cover={profile?.coverPicture?.original?.url} />
      <GridLayout className="pt-6">
        <GridItemFour>
          <Details profile={profile} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <FeedType
            stats={profile?.stats}
            setFeedType={setFeedType}
            feedType={feedType}
          />
          {(feedType === 'POST' ||
            feedType === 'COMMENT' ||
            feedType === 'MIRROR') && (
            <Feed profile={profile} type={feedType} />
          )}
          {feedType === 'NFT' && <NFTFeed profile={profile} />}
        </GridItemEight>
      </GridLayout> */}
		</div>
	)
}

export default ViewProfile
