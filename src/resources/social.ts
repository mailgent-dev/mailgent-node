import type { HttpClient } from "../http"
import type {
  CreateSocialPostParams,
  CreateSocialPostResponse,
  SocialAccountList,
  SocialPostDetail,
  SocialPostList,
} from "../types"

export class SocialResource {
  constructor(private http: HttpClient) {}

  /**
   * Connected social accounts. Connecting and disconnecting accounts is
   * console-only (Settings → Integrations) — agents cannot initiate connections.
   */
  listAccounts(): Promise<SocialAccountList> {
    return this.http.get<SocialAccountList>("/v0/social/accounts")
  }

  /**
   * Create a post across connected accounts. Posting is asynchronous —
   * poll `getPost()` for per-platform results.
   */
  createPost(params: CreateSocialPostParams): Promise<CreateSocialPostResponse> {
    return this.http.post<CreateSocialPostResponse>("/v0/social/posts", params)
  }

  listPosts(params?: { limit?: number }): Promise<SocialPostList> {
    const query = new URLSearchParams()
    if (params?.limit) query.set("limit", String(params.limit))
    const qs = query.toString()
    return this.http.get<SocialPostList>(`/v0/social/posts${qs ? `?${qs}` : ""}`)
  }

  /** Post status plus per-platform publish results. */
  getPost(postId: string): Promise<SocialPostDetail> {
    return this.http.get<SocialPostDetail>(`/v0/social/posts/${encodeURIComponent(postId)}`)
  }
}
