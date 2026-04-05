export { Hivekey } from "./client"
export { HivekeySupervisor } from "./supervisor"
export { HivekeyApiError } from "./errors"
export type {
  HivekeyConfig,
  SupervisorConfig,
  MessageResponse,
  ThreadResponse,
  ThreadDetailResponse,
  VaultCredentialType,
  CredentialMetadata,
  CredentialWithData,
  IdentityResponse,
  IdentitySummary,
  IdentityDetail,
  CreateIdentityParams,
  CreateIdentityResponse,
  RotateKeyResponse,
  PaginatedIdentities,
  CalendarEvent,
  CreateCalendarEventParams,
  UpdateCalendarEventParams,
  PaginatedCalendarEvents,
  ActivityLog,
  LogsStatsResponse,
  TotpResponse,
  PaginatedMessages,
  PaginatedThreads,
  PaginatedLogs,
  VaultList,
} from "./types"
export type { DidDocument } from "./resources/did"
