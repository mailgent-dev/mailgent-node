import { describe, it, expect, vi, afterEach } from "vitest"
import { Mailgent } from "../src/client"

describe("SocialResource", () => {
  afterEach(() => vi.restoreAllMocks())

  it("client has social resource", () => {
    const client = new Mailgent({ apiKey: "mgnt-test" })
    expect(client.social).toBeDefined()
  })

  it("listAccounts calls GET /v0/social/accounts", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true, status: 200,
      json: () => Promise.resolve({
        accounts: [{
          id: "sa-1", platform: "x", username: "agent", displayName: "Agent",
          connectedAt: "2026-06-01T00:00:00Z",
        }],
      }),
    })
    vi.stubGlobal("fetch", mockFetch)

    const client = new Mailgent({ apiKey: "mgnt-test" })
    const result = await client.social.listAccounts()
    expect(result.accounts).toHaveLength(1)
    expect(result.accounts[0].platform).toBe("x")
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/v0/social/accounts"),
      expect.objectContaining({ method: "GET" }),
    )
  })

  it("createPost calls POST /v0/social/posts", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true, status: 201,
      json: () => Promise.resolve({
        postId: "post-1", status: "processing",
        accounts: [{ id: "sa-1", platform: "x", username: "agent" }],
        message: "Posting is asynchronous.",
      }),
    })
    vi.stubGlobal("fetch", mockFetch)

    const client = new Mailgent({ apiKey: "mgnt-test" })
    const result = await client.social.createPost({ text: "Hello world", platforms: ["x"] })
    expect(result.postId).toBe("post-1")
    expect(result.accounts).toHaveLength(1)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/v0/social/posts"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ text: "Hello world", platforms: ["x"] }),
      }),
    )
  })

  it("listPosts calls GET /v0/social/posts", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true, status: 200,
      json: () => Promise.resolve({
        posts: [{
          id: "post-1", caption: "Hello", platforms: ["x"], status: "processed",
          scheduledAt: null, createdAt: "2026-06-10T00:00:00Z",
        }],
      }),
    }))

    const client = new Mailgent({ apiKey: "mgnt-test" })
    const result = await client.social.listPosts()
    expect(result.posts).toHaveLength(1)
    expect(result.posts[0].status).toBe("processed")
  })

  it("listPosts supports limit filter", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true, status: 200,
      json: () => Promise.resolve({ posts: [] }),
    })
    vi.stubGlobal("fetch", mockFetch)

    const client = new Mailgent({ apiKey: "mgnt-test" })
    await client.social.listPosts({ limit: 5 })
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("limit=5"),
      expect.any(Object),
    )
  })

  it("getPost calls GET /v0/social/posts/:id", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true, status: 200,
      json: () => Promise.resolve({
        post: { id: "post-1", status: "processed" },
        results: { x: { success: true } },
      }),
    })
    vi.stubGlobal("fetch", mockFetch)

    const client = new Mailgent({ apiKey: "mgnt-test" })
    const result = await client.social.getPost("post-1")
    expect(result.post).toBeDefined()
    expect(result.results).toBeDefined()
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/v0/social/posts/post-1"),
      expect.any(Object),
    )
  })
})
