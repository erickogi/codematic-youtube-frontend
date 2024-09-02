export interface VideoDetails {
  title: string
  description: string
  viewCount: number
  likeCount: number
  channelTitle: string
  thumbnails: {
    default?: Thumbnail
    medium?: Thumbnail
    high?: Thumbnail
  }
  publishedAt: string
}
interface Thumbnail {
  url: string
  width: number
  height: number
}

export interface Comment {
  id: string
  text: string
  author: string
  publishedAt: string
  likeCount: number
  replyCount: number
  authorProfileImageUrl: string
  isExpanded?: boolean
}

export interface CommentsResponse {
  comments: Comment[]
  nextPageToken: string | null
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
}
