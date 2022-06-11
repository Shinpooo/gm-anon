import { gql, useQuery } from '@apollo/client'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import consoleLog from '../lib/consoleLog'
import Image from 'next/image'
import matic from '../../public/images/matic.png'

export const PROFILE_QUERY = gql`
  query Profile($request: ProfileQueryRequest!) {
   profiles(request: $request) {
      items {
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
  }
`

const ViewProfile: NextPage = () => {
  const {
    query: { username, type }
  } = useRouter()
//   const [feedType, setFeedType] = useState<string>(
//     type && ['post', 'comment', 'mirror', 'nft'].includes(type as string)
//       ? type?.toString().toUpperCase()
//       : 'POST'
//   )
  const { data, loading, error } = useQuery(PROFILE_QUERY, {
    variables: { request: { handles: username } },
    skip: !username,
    onCompleted(data) {
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched profile details Profile:${data?.profiles?.items[0]?.id}`
      )
    }
  })

//   if (error) return <Custom500 />
  if (loading || !data) return <></>
//   if (data?.profiles?.items?.length === 0) return <Custom404 />

  const profile = data?.profiles?.items[0]

  return (
    <div className="relative max-w-4xl mx-auto min-h-screen">
        {profile?.coverPicture ? 
    <Image src={profile?.coverPicture?.original?.url} height="300px" width="900px"></Image> :
    <div className='bg-orange-500 h-72 w-full'></div>}
    <div className="absolute bottom-100 inset-x-0 top-48  flex mx-auto justify-center">
        <div className='rounded-full overflow-hidden border-gray-200 border-4'><Image src={profile?.picture?.original?.url} height="200px" width="200px"></Image></div>
    
    </div>
    <div className='bg-gray-200 w-full mx-auto flex justify-center pt-32 pb-4 flex-col text-center rounded-md'>
        <p className='text-4xl font-bold'>{profile?.name}</p>
        <p>@{profile?.handle}</p>
        <div className='flex justify-center gap-4 mb-10'>
            <div className='flex flex-col justify-center'>
                <p className='text-xl'>{profile?.stats?.totalFollowers}</p>
                <p>Followers </p> 
            </div>
            <div className='flex flex-col justify-center'>
                <p className='text-xl'>{profile?.stats?.totalFollowing}</p>
                <p>Following </p> 
            </div>
            <div className='flex flex-col justify-center'>
                <p className='text-xl'>0</p>
                <p>Answers </p> 
            </div>
        </div>
         <input
                        placeholder={'Ask me anything'}
                        className="mx-10 enabled:border-yellow-400 p-2 text-base placeholder-black bg-gray-100 placeholder-opacity-50 font-mlp-thin pb-12 rounded-xl mb-2"
                        // onChange={}
                        // value={}
                    />
                    <button className='bg-yellow-500 mx-auto px-4 py-2 rounded-lg flex gap-2 font-bold hover:scale-110 transition duration-300'>Ask for 1 <Image src={matic} height="24px" width="24px"></Image></button>
    </div>
    <p className='mt-2 font-light'>Payment is locked in the smart contract until you get a reply. <br></br>Redeem your payment anytime by burning your question NFT!</p>
   
                    
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