export type LensProfile = {
	name: string
	handle: string
    bio: string
	picture: {
		original?: {
			url: string
		}
		uri?: string
	}
    coverPicture: {
		original?: {
			url: string
		}
		uri?: string
	}
    ownerdBy: string
	stats: {
		totalPosts: number
		totalFollowers: number
		totalFollowing: number
		totalCollects: number
		totalPublications: number
	}
}