import type { HttpClient } from "../http"
import type { CredentialMetadata, CredentialWithData, VaultCredentialType, VaultList, TotpResponse } from "../types"

export class VaultResource {
  constructor(private http: HttpClient) {}

  list(): Promise<VaultList> {
    return this.http.get<VaultList>("/v0/vault")
  }

  get(name: string): Promise<CredentialWithData> {
    return this.http.get<CredentialWithData>(`/v0/vault/${encodeURIComponent(name)}`)
  }

  store(name: string, params: {
    type: VaultCredentialType
    data: Record<string, unknown>
    metadata?: Record<string, unknown>
    expiresAt?: string
  }): Promise<CredentialMetadata> {
    return this.http.put<CredentialMetadata>(`/v0/vault/${encodeURIComponent(name)}`, params)
  }

  delete(name: string): Promise<void> {
    return this.http.delete(`/v0/vault/${encodeURIComponent(name)}`)
  }

  totp(name: string): Promise<TotpResponse> {
    return this.http.get<TotpResponse>(`/v0/vault/${encodeURIComponent(name)}/totp`)
  }
}
