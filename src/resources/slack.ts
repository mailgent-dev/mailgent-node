import type { HttpClient } from "../http"
import type {
  SendSlackMessageParams,
  SlackChannelList,
  SlackConnectResponse,
  SlackConnection,
  SlackMessageList,
  SlackMessageSent,
} from "../types"

export class SlackResource {
  constructor(private http: HttpClient) {}

  /** Current Slack workspace connection status. Never includes the bot token. */
  connection(): Promise<SlackConnection> {
    return this.http.get<SlackConnection>("/v0/slack/connection")
  }

  /**
   * Get an "Add to Slack" install URL. Open it in a browser and authorize the
   * workspace; the connection then appears on `connection()`.
   */
  connect(): Promise<SlackConnectResponse> {
    return this.http.post<SlackConnectResponse>("/v0/slack/connect", undefined)
  }

  /** Disconnect the Slack workspace. */
  disconnect(): Promise<{ message: string }> {
    return this.http.delete<{ message: string }>("/v0/slack/connection")
  }

  /** Channels the bot can see. The bot must be a member of a channel to post there. */
  listChannels(): Promise<SlackChannelList> {
    return this.http.get<SlackChannelList>("/v0/slack/channels")
  }

  /** Send a message to a channel. Pass `threadTs` to reply in a thread. */
  sendMessage(params: SendSlackMessageParams): Promise<SlackMessageSent> {
    return this.http.post<SlackMessageSent>("/v0/slack/messages", params)
  }

  /** List stored inbound messages (store-and-poll). `since` is an ISO 8601 timestamp. */
  listMessages(params?: { channel?: string; since?: string; limit?: number }): Promise<SlackMessageList> {
    const query = new URLSearchParams()
    if (params?.channel) query.set("channel", params.channel)
    if (params?.since) query.set("since", params.since)
    if (params?.limit) query.set("limit", String(params.limit))
    const qs = query.toString()
    return this.http.get<SlackMessageList>(`/v0/slack/messages${qs ? `?${qs}` : ""}`)
  }
}
