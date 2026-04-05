import { describe, it, expect } from "vitest"
import { HivekeyApiError } from "../src/errors"

describe("HivekeyApiError", () => {
  it("has correct properties", () => {
    const err = new HivekeyApiError(404, "not_found", "Resource not found")
    expect(err.status).toBe(404)
    expect(err.code).toBe("not_found")
    expect(err.message).toBe("Resource not found")
    expect(err.name).toBe("HivekeyApiError")
  })

  it("is an instance of Error", () => {
    const err = new HivekeyApiError(500, "internal", "Server error")
    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(HivekeyApiError)
  })
})
