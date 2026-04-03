import type { HttpClient } from "../http"
import type { MessageResponse, PaginatedMessages, PaginatedThreads, ThreadDetailResponse } from "../types"

export class MailResource {
  constructor(private http: HttpClient) {}

  send(params: {
    to: string[]
    subject: string
    text: string
    html?: string
    cc?: string[]
    bcc?: string[]
  }): Promise<MessageResponse> {
    return this.http.post<MessageResponse>("/v0/messages/send", params)
  }

  reply(messageId: string, params: { text: string; html?: string }): Promise<MessageResponse> {
    return this.http.post<MessageResponse>(`/v0/messages/${encodeURIComponent(messageId)}/reply`, params)
  }

  listMessages(params?: { limit?: number; labels?: string; pageToken?: string }): Promise<PaginatedMessages> {
    const query = new URLSearchParams()
    if (params?.limit) query.set("limit", String(params.limit))
    if (params?.labels) query.set("labels", params.labels)
    if (params?.pageToken) query.set("pageToken", params.pageToken)
    const qs = query.toString()
    return this.http.get<PaginatedMessages>(`/v0/messages${qs ? `?${qs}` : ""}`)
  }

  getMessage(messageId: string): Promise<MessageResponse> {
    return this.http.get<MessageResponse>(`/v0/messages/${encodeURIComponent(messageId)}`)
  }

  updateLabels(messageId: string, params: { addLabels?: string[]; removeLabels?: string[] }): Promise<MessageResponse> {
    return this.http.patch<MessageResponse>(`/v0/messages/${encodeURIComponent(messageId)}`, params)
  }

  deleteMessage(messageId: string): Promise<void> {
    return this.http.delete(`/v0/messages/${encodeURIComponent(messageId)}`)
  }

  listThreads(params?: { limit?: number; pageToken?: string }): Promise<PaginatedThreads> {
    const query = new URLSearchParams()
    if (params?.limit) query.set("limit", String(params.limit))
    if (params?.pageToken) query.set("pageToken", params.pageToken)
    const qs = query.toString()
    return this.http.get<PaginatedThreads>(`/v0/threads${qs ? `?${qs}` : ""}`)
  }

  getThread(threadId: string, params?: { limit?: number }): Promise<ThreadDetailResponse> {
    const query = new URLSearchParams()
    if (params?.limit) query.set("limit", String(params.limit))
    const qs = query.toString()
    return this.http.get<ThreadDetailResponse>(`/v0/threads/${encodeURIComponent(threadId)}${qs ? `?${qs}` : ""}`)
  }

  deleteThread(threadId: string): Promise<void> {
    return this.http.delete(`/v0/threads/${encodeURIComponent(threadId)}`)
  }
}
