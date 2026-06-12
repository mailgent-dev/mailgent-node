import { describe, it, expect, vi, afterEach } from "vitest"
import { Mailgent } from "../src/client"

describe("SlackResource", () => {
  afterEach(() => vi.restoreAllMocks())

  it("client has slack resource", () => {
    const client = new Mailgent({ apiKey: "loid-test" })
    expect(client.slack).toBeDefined()
  })

  it("connection calls GET /v0/slack/connection", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true, status: 200,
      json: () => Promise.resolve({
        connected: true, teamId: "T123", teamName: "Acme", botUserId: "U456",
        slackScopes: ["chat:write"], installedAt: "2026-06-01T00:00:00Z",
      }),
    })
    vi.stubGlobal("fetch", mockFetch)

    const client = new Mailgent({ apiKey: "loid-test" })
    const result = await client.slack.connection()
    expect(result.connected).toBe(true)
    expect(result.teamName).toBe("Acme")
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/v0/slack/connection"),
      expect.objectContaining({ method: "GET" }),
    )
  })

  it("connect calls POST /v0/slack/connect", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true, status: 200,
      json: () => Promise.resolve({
        installUrl: "https://slack.com/oauth/v2/authorize?...",
        expiresInSeconds: 900,
        message: "Open installUrl in a browser.",
      }),
    })
    vi.stubGlobal("fetch", mockFetch)

    const client = new Mailgent({ apiKey: "loid-test" })
    const result = await client.slack.connect()
    expect(result.installUrl).toContain("slack.com")
    expect(result.expiresInSeconds).toBe(900)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/v0/slack/connect"),
      expect.objectContaining({ method: "POST" }),
    )
  })

  it("disconnect calls DELETE /v0/slack/connection", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true, status: 200,
      json: () => Promise.resolve({ message: "Slack workspace 'Acme' disconnected" }),
    })
    vi.stubGlobal("fetch", mockFetch)

    const client = new Mailgent({ apiKey: "loid-test" })
    const result = await client.slack.disconnect()
    expect(result.message).toContain("disconnected")
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/v0/slack/connection"),
      expect.objectContaining({ method: "DELETE" }),
    )
  })

  it("listChannels calls GET /v0/slack/channels", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true, status: 200,
      json: () => Promise.resolve({
        channels: [{ id: "C123", name: "general", isPrivate: false, botIsMember: true }],
      }),
    }))

    const client = new Mailgent({ apiKey: "loid-test" })
    const result = await client.slack.listChannels()
    expect(result.channels).toHaveLength(1)
    expect(result.channels[0].botIsMember).toBe(true)
  })

  it("sendMessage calls POST /v0/slack/messages", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true, status: 201,
      json: () => Promise.resolve({ channel: "C123", ts: "1718000000.000100" }),
    })
    vi.stubGlobal("fetch", mockFetch)

    const client = new Mailgent({ apiKey: "loid-test" })
    const result = await client.slack.sendMessage({ channel: "C123", text: "Hello" })
    expect(result.ts).toBe("1718000000.000100")
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/v0/slack/messages"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ channel: "C123", text: "Hello" }),
      }),
    )
  })

  it("listMessages calls GET /v0/slack/messages", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true, status: 200,
      json: () => Promise.resolve({
        messages: [{
          id: "sm-1", channelId: "C123", userId: "U456", text: "hi",
          ts: "1718000000.000100", threadTs: null, eventType: "message",
          receivedAt: "2026-06-10T00:00:00Z",
        }],
      }),
    }))

    const client = new Mailgent({ apiKey: "loid-test" })
    const result = await client.slack.listMessages()
    expect(result.messages).toHaveLength(1)
    expect(result.messages[0].channelId).toBe("C123")
  })

  it("listMessages supports channel/since/limit filters", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true, status: 200,
      json: () => Promise.resolve({ messages: [] }),
    })
    vi.stubGlobal("fetch", mockFetch)

    const client = new Mailgent({ apiKey: "loid-test" })
    await client.slack.listMessages({ channel: "C123", since: "2026-06-01T00:00:00Z", limit: 10 })
    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain("channel=C123")
    expect(url).toContain("limit=10")
    expect(url).toContain("since=")
  })
})
