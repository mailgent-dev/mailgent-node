import type { HttpClient } from "../http"
import type { PaginatedLogs, LogsStatsResponse } from "../types"

export class LogsResource {
  constructor(private http: HttpClient) {}

  list(params?: {
    limit?: number
    category?: string
    action?: string
    status?: string
    severity?: string
    pageToken?: string
  }): Promise<PaginatedLogs> {
    const query = new URLSearchParams()
    if (params?.limit) query.set("limit", String(params.limit))
    if (params?.category) query.set("category", params.category)
    if (params?.action) query.set("action", params.action)
    if (params?.status) query.set("status", params.status)
    if (params?.severity) query.set("severity", params.severity)
    if (params?.pageToken) query.set("pageToken", params.pageToken)
    const qs = query.toString()
    return this.http.get<PaginatedLogs>(`/v0/logs${qs ? `?${qs}` : ""}`)
  }

  stats(): Promise<LogsStatsResponse> {
    return this.http.get<LogsStatsResponse>("/v0/logs/stats")
  }
}
