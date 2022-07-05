import { gql, useQuery } from '@apollo/client'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import consoleLog from '../lib/consoleLog'
import Image from 'next/image'
import matic from '../../public/images/matic.png'
import { useContractRead, useAccount, useContractWrite, useContractReads } from 'wagmi'
import askme_abi from '../abis/AskMe.json'
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
	addressOrName: '0x12a5D5062b1Be8949cDD6195e3A916A2d8e76589',
	contractInterface: askme_abi,
}

const ViewProfile: NextPage = () => {
	const [newAskFee, setNewAskFee] = useState<string>('0')
	const [questionText, setQuestionText] = useState<string>('')
	const [askFee, setAskFee] = useState<any>(0)
	const [isActive, setIsActive] = useState<any>(false)
	const {
		query: { username, type },
	} = useRouter()
	const { address, connector } = useAccount()
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
		},
	})
	let intId = parseInt(data?.profile.id.toString().slice(2), 16)
	console.log("int id", intId)

	const {
		data: reads,
		isError,
		isLoading,
	} = useContractReads({
		contracts: [
			{
				...askmeContract,
				functionName: 'isActive',
				args: [1429],
			},
			{
				...askmeContract,
				functionName: 'askFee',
				args: [1429],
			},
		],
		onSuccess(reads) {
			setIsActive(reads[0])
			setAskFee(ethers.utils.formatUnits(reads[1]))
			console.log("fee", ethers.utils.formatUnits(reads[1]))
		},
	})
	
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
	// 		contractInterface: askme_abi,
	// 	},
	// 	'isActive',
	// 	{
	// 		args: data?.profile.id,
	// 		onSuccess(isActive) {
	// 			console.log('Success', isActive)
	// 		},
	// 	}
	// )

	const {
		data: updateprofile,
		write: updatefee,
	} = useContractWrite(
		{
			addressOrName: '0x12a5D5062b1Be8949cDD6195e3A916A2d8e76589',
			contractInterface: askme_abi,
			functionName: 'updateProfile',
			args: ['true', ethers.utils.parseUnits(newAskFee, 'ether'), intId],
			onSuccess(updateProfile) {
				console.log('Success', updateProfile)
			}
		},
	)

	console.log("reads", reads)

	// const { data: askfee } = useContractRead(
	// 	{
	// 		addressOrName: '0x12a5D5062b1Be8949cDD6195e3A916A2d8e76589',
	// 		contractInterface: askme_abi,
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
		addressOrName: '0x12a5D5062b1Be8949cDD6195e3A916A2d8e76589',
		contractInterface: askme_abi,
		functionName: 'mint',
		args: [questionText, 1429],
		onSuccess(askquestion) {
			console.log('Success', askquestion)
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

	//   if (error) return <Custom500 />
	if (loading || !data) return <></>
	//   if (data?.profiles?.items?.length === 0) return <Custom404 />

	const profile = data?.profile
	console.log(profile?.ownedBy)
	return (
		<div className="relative max-w-4xl mx-auto min-h-screen">
			{profile?.coverPicture ? (
				<Image src={profile?.coverPicture?.original?.url} height="300px" width="900px"></Image>
			) : (
				<div className="bg-orange-500 h-72 w-full"></div>
			)}
			<div className="absolute bottom-100 inset-x-0 top-48  flex mx-auto justify-center">
				<div className="rounded-full overflow-hidden border-gray-200 border-4">
					<Image src={profile?.picture?.original?.url} height="200px" width="200px"></Image>
				</div>
			</div>
			<div className="bg-gray-200 w-full mx-auto flex justify-center pt-32 pb-4 flex-col text-center rounded-md">
				<p className="relative bottom-0 inset-x-0 top-0  flex mx-auto justify-center"></p>
				<p className="text-4xl font-bold">{profile?.name}</p>
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
						<p className="text-xl">0</p>
						<p>Answers </p>
					</div>
					<div className="flex flex-col justify-center">
						<p className="text-xl">{isActive.toString()}</p>
						<p>is Active </p>
					</div>
					<div className="flex flex-col justify-center">
						<p className="text-xl">{askFee}</p>
						<p>Fees </p>
					</div>
				</div>
				{profile?.ownedBy === address ? (
					<div className="flex justify-center">
						<div className="flex flex-col">
							<p className="text-sm">Ask fee (MATIC):</p>
							<input
								placeholder={'1'}
								className="mx-auto enabled:border-yellow-400 p-2 text-base placeholder-black bg-gray-100 placeholder-opacity-50 font-mlp-thin rounded-xl mb-2"
								onChange={e => setNewAskFee(e.target.value)}
								// value={}
							/>
							<button
								className="bg-yellow-500 mx-auto px-4 py-2 items-center rounded-lg flex gap-2 font-bold hover:scale-110 transition duration-300"
								onClick={() => updatefee()}
							>
								Activate Account
							</button>
						</div>
					</div>
				) : (
					<>
						<input
							placeholder={'Ask me anything'}
							className="mx-10 enabled:border-yellow-400 p-2 text-base placeholder-black bg-gray-100 placeholder-opacity-50 font-mlp-thin pb-12 rounded-xl mb-2"
							onChange={e => setQuestionText(e.target.value)}
							// value={}
						/>
						<button
							className="bg-yellow-500 mx-auto px-4 py-2 rounded-lg flex gap-2 font-bold hover:scale-110 transition duration-300"
							onClick={() => askquestion()}
						>
							Ask for {askFee}
							<Image src={matic} height="24px" width="24px"></Image>
						</button>
					</>
				)}
			</div>
			<p className="mt-2 font-light">
				Payment is locked in the smart contract until you get a reply. <br></br>Redeem your payment anytime by
				burning your question NFT!
			</p>

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
