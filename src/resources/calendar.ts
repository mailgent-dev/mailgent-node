import type { HttpClient } from "../http"
import type {
  CalendarEvent,
  CreateCalendarEventParams,
  UpdateCalendarEventParams,
  PaginatedCalendarEvents,
} from "../types"

export class CalendarResource {
  constructor(private http: HttpClient) {}

  create(params: CreateCalendarEventParams): Promise<CalendarEvent> {
    return this.http.post<CalendarEvent>("/v0/calendar", params)
  }

  list(params?: { limit?: number; from?: string; to?: string }): Promise<PaginatedCalendarEvents> {
    const query = new URLSearchParams()
    if (params?.limit) query.set("limit", String(params.limit))
    if (params?.from) query.set("from", params.from)
    if (params?.to) query.set("to", params.to)
    const qs = query.toString()
    return this.http.get<PaginatedCalendarEvents>(`/v0/calendar${qs ? `?${qs}` : ""}`)
  }

  get(eventId: string): Promise<CalendarEvent> {
    return this.http.get<CalendarEvent>(`/v0/calendar/${encodeURIComponent(eventId)}`)
  }

  update(eventId: string, params: UpdateCalendarEventParams): Promise<CalendarEvent> {
    return this.http.patch<CalendarEvent>(`/v0/calendar/${encodeURIComponent(eventId)}`, params)
  }

  delete(eventId: string): Promise<void> {
    return this.http.delete(`/v0/calendar/${encodeURIComponent(eventId)}`)
  }

  setPublic(enabled: boolean): Promise<{ calendarPublic: boolean }> {
    return this.http.post<{ calendarPublic: boolean }>("/v0/calendar/public", { enabled })
  }
}
