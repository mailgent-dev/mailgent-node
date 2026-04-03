import type { HttpClient } from "../http"

export interface DidDocument {
  "@context": string[]
  id: string
  alsoKnownAs?: string[]
  verificationMethod?: Array<{
    id: string
    type: string
    controller: string
    publicKeyMultibase: string
  }>
  authentication?: string[]
  assertionMethod?: string[]
  service?: Array<{
    id: string
    type: string
    serviceEndpoint: string
  }>
}

export class DidResource {
  constructor(private http: HttpClient) {}

  resolve(identityId: string): Promise<DidDocument> {
    return this.http.get<DidDocument>(`/identities/${encodeURIComponent(identityId)}/did.json`)
  }

  resolveDomain(): Promise<DidDocument> {
    return this.http.get<DidDocument>("/.well-known/did.json")
  }
}
