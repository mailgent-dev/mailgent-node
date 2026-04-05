import { describe, it, expect } from "vitest"
import { Hivekey } from "../src/client"

describe("Hivekey client", () => {
  it("throws if no API key provided", () => {
    expect(() => new Hivekey({ apiKey: "" })).toThrow("API key is required")
  })

  it("creates client with API key", () => {
    const client = new Hivekey({ apiKey: "mgent-test123" })
    expect(client.identity).toBeDefined()
    expect(client.mail).toBeDefined()
    expect(client.vault).toBeDefined()
    expect(client.logs).toBeDefined()
    expect(client.did).toBeDefined()
  })

  it("accepts custom base URL", () => {
    const client = new Hivekey({ apiKey: "mgent-test", baseUrl: "http://localhost:3001" })
    expect(client.identity).toBeDefined()
  })
})
