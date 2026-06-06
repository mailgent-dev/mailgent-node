import { MailgentApiError } from "../errors"
import type { HttpClient } from "../http"
import type {
  PaginatedPayments,
  PaymentActivityList,
  PaymentDetail,
  PaymentsPayParams,
  PaymentsPayResponse,
} from "../types"
import { MandatesResource } from "./payments-mandates"

export class PaymentsResource {
  /** Spend policy for `payments.pay()`. See {@link MandatesResource}. */
  readonly mandates: MandatesResource

  constructor(private http: HttpClient) {
    this.mandates = new MandatesResource(http)
  }

  /**
   * Pay any x402-protected URL. Drives the full handshake on your project's
   * wallet: discover 402 challenge, check mandate caps, sign EIP-3009, retry,
   * record. Returns a discriminated union — branch on `ok`.
   *
   * Requires the `payments:spend` scope on the API key.
   */
  async pay(params: PaymentsPayParams): Promise<PaymentsPayResponse> {
    const data = await this.http.postUnchecked<unknown>("/v0/payments/pay", {
      url: params.url,
      dryRun: params.dryRun,
    })
    if (!data || typeof data !== "object" || !("ok" in (data as Record<string, unknown>))) {
      throw new MailgentApiError(
        0,
        "unexpected_response",
        "payments.pay returned a body without an `ok` discriminator",
      )
    }
    return data as PaymentsPayResponse
  }

  list(params?: { limit?: number }): Promise<PaginatedPayments> {
    const query = new URLSearchParams()
    if (params?.limit) query.set("limit", String(params.limit))
    const qs = query.toString()
    return this.http.get<PaginatedPayments>(`/v0/payments${qs ? `?${qs}` : ""}`)
  }

  /**
   * Bank-statement-style activity feed for the authenticated identity —
   * merges payments received (`direction: "in"`) and sent (`direction: "out"`),
   * latest first. No scope required.
   */
  activity(params?: { limit?: number }): Promise<PaymentActivityList> {
    const query = new URLSearchParams()
    if (params?.limit) query.set("limit", String(params.limit))
    const qs = query.toString()
    return this.http.get<PaymentActivityList>(`/v0/payments/activity${qs ? `?${qs}` : ""}`)
  }

  get(paymentId: string): Promise<PaymentDetail> {
    return this.http.get<PaymentDetail>(`/v0/payments/${encodeURIComponent(paymentId)}`)
  }
}
