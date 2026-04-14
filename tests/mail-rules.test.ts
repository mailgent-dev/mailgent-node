import { describe, it, expect, vi, afterEach } from "vitest"
import { HttpClient } from "../src/http"
import { MailResource } from "../src/resources/mail"

describe("MailResource — Email Rules", () => {
  afterEach(() => vi.restoreAllMocks())

  function mockHttp() {
    const http = new HttpClient("https://api.loomal.ai", "loid-test")
    return { http, mail: new MailResource(http) }
  }

  it("listRules calls GET /v0/email-rules", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ rules: [{ id: "r1", type: "BLOCK", scope: "SEND", value: "*@spam.com", createdAt: "2026-01-01T00:00:00Z" }] }),
    })
    vi.stubGlobal("fetch", mockFetch)

    const { mail } = mockHttp()
    const result = await mail.listRules()

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.loomal.ai/v0/email-rules",
      expect.objectContaining({ method: "GET" }),
    )
    expect(result.rules).toHaveLength(1)
    expect(result.rules[0].type).toBe("BLOCK")
  })

  it("addRule calls POST /v0/email-rules with correct body", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ rule: { id: "r2", type: "ALLOW", scope: "RECEIVE", value: "alice@example.com", createdAt: "2026-01-01T00:00:00Z" } }),
    })
    vi.stubGlobal("fetch", mockFetch)

    const { mail } = mockHttp()
    const result = await mail.addRule({ type: "ALLOW", scope: "RECEIVE", value: "alice@example.com" })

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.loomal.ai/v0/email-rules",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ type: "ALLOW", scope: "RECEIVE", value: "alice@example.com" }),
      }),
    )
    expect(result.rule.type).toBe("ALLOW")
    expect(result.rule.value).toBe("alice@example.com")
  })

  it("deleteRule calls DELETE /v0/email-rules/:id", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
    })
    vi.stubGlobal("fetch", mockFetch)

    const { mail } = mockHttp()
    await mail.deleteRule("rule-123")

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.loomal.ai/v0/email-rules/rule-123",
      expect.objectContaining({ method: "DELETE" }),
    )
  })
})
