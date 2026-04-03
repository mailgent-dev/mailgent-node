import { describe, it, expect } from "vitest"
import { Mailgent } from "../src/client"

describe("Mailgent client", () => {
  it("throws if no API key provided", () => {
    expect(() => new Mailgent({ apiKey: "" })).toThrow("API key is required")
  })

  it("creates client with API key", () => {
    const client = new Mailgent({ apiKey: "mgent-test123" })
    expect(client.identity).toBeDefined()
    expect(client.mail).toBeDefined()
    expect(client.vault).toBeDefined()
    expect(client.logs).toBeDefined()
    expect(client.did).toBeDefined()
  })

  it("accepts custom base URL", () => {
    const client = new Mailgent({ apiKey: "mgent-test", baseUrl: "http://localhost:3001" })
    expect(client.identity).toBeDefined()
  })
})
