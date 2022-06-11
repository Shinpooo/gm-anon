import { gql } from '@apollo/client'

const LOAD_PROFILE = gql`
  query Profiles {
    profiles(request: { handles: ["0xtestinprod.lens"], limit: 1 }) {
      items {
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

export default LOAD_PROFILE