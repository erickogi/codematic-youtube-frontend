export interface VideoDetails {
  title: string
  description: string
  viewCount: number
  likeCount: number
}

export interface Comment {
  id: string
  text: string
  author: string
  publishedAt: string
  likeCount: number
  replyCount: number
  authorProfileImageUrl: string
}

export interface CommentsResponse {
  comments: Comment[]
  nextPageToken: string | null
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
}
