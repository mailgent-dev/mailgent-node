# Mailgent Node.js SDK

The official Node.js/TypeScript SDK for the [Mailgent API](https://docs.mailgent.dev) -- identity, mail, vault, calendar, and buyer-side x402 payments for AI agents.

[![npm](https://img.shields.io/npm/v/@mailgent/sdk)](https://www.npmjs.com/package/@mailgent/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

- Zero dependencies (native `fetch`)
- ESM + CJS dual output
- Full TypeScript type definitions
- Node 18+

## Installation

```bash
npm install @mailgent/sdk
```

## Quick start

```typescript
import { Mailgent } from "@mailgent/sdk";

const client = new Mailgent({ apiKey: "loid-..." });

const { messages } = await client.mail.listMessages({ limit: 10 });
```

## Payments (buyer)

Pay any x402-protected URL from your agent's own wallet. The SDK drives the
full handshake against `api.mailgent.dev`: discover the 402 challenge, check
your mandate caps, sign the EIP-3009 authorization, retry, and record.

```typescript
const result = await client.payments.pay({ url: "https://api.example.com/paid" });
if (result.ok) {
  // payment settled — proceed with result
}
```

Spend caps are enforced server-side via mandates. Create one per project:

```typescript
await client.payments.mandates.create({
  maxPerCallUsdc: "0.10",
  dailyCapUsdc: "5.00",
});
```

Use `client.payments.activity()` for a bank-statement-style feed of payments
sent and received.

### Webhook signature verification

Mailgent sends `X-Mailgent-Signature: sha256=<hex>` (HMAC-SHA256 of the raw
request body) and `X-Mailgent-Event` / `X-Mailgent-Idempotency-Key` for
event type and de-duplication. Verify before trusting the body:

```typescript
import { verifyWebhook } from "@mailgent/sdk/webhook";

app.post(
  "/webhooks/mailgent",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const ok = await verifyWebhook(
      req.body.toString(),
      req.header("x-mailgent-signature"),
      process.env.MAILGENT_WEBHOOK_SECRET!,
    );
    if (!ok) return res.status(400).send("invalid signature");

    // de-dupe on req.header("x-mailgent-idempotency-key"), then handle.
    // Today the only event type is `payment.received`.
  },
);
```

Web Crypto under the hood — same helper runs on Node, Bun, Deno, and
Cloudflare Workers.

## Authentication

Create an API key in the [Mailgent Console](https://console.mailgent.dev). Keys are prefixed with `loid-`.

Pass the key directly:

```typescript
const client = new Mailgent({ apiKey: "loid-..." });
```

Or load from an environment variable:

```typescript
const client = new Mailgent({ apiKey: process.env.MAILGENT_API_KEY });
```

## Usage

### Identity

```typescript
const identity = await client.identity.whoami();
```

### Vault

The vault is password-manager-style encrypted secret storage (AES-256-GCM at rest). Use `client.vault.store()` for arbitrary types, or the typed helpers below.

```typescript
// Simple API key
await client.vault.storeApiKey("stripe", "sk_live_...");

// OAuth-style client credentials (client id + secret)
await client.vault.storeApiKey("twitter", {
  clientId: "abc123",
  secret: "def456",
});

// Credit card (encrypted at rest — this is a secret vault, not a payment processor)
await client.vault.storeCard("personal-visa", {
  cardholder: "Jane Doe",
  number: "4242 4242 4242 4242",
  expMonth: "12",
  expYear: "2029",
  cvc: "123",
  zip: "94103",
}, { metadata: { brand: "Visa" } });

// Shipping address
await client.vault.storeShippingAddress("home", {
  name: "Autonomous Agent",
  line1: "1 Demo Way",
  city: "San Francisco",
  state: "CA",
  postcode: "94103",
  country: "US",
});
```

Supported credential types: `LOGIN`, `API_KEY`, `OAUTH`, `TOTP`, `SSH_KEY`, `DATABASE`, `SMTP`, `AWS`, `CERTIFICATE`, `CARD`, `SHIPPING_ADDRESS`, `CUSTOM`.

### More resources

The SDK also exposes `client.mail`, `client.calendar`, `client.logs`, and `client.did`. See the full reference at **[docs.mailgent.dev](https://docs.mailgent.dev)** for request/response shapes, pagination, and end-to-end examples.

## Error handling

All API errors are thrown as `MailgentApiError` with structured fields:

```typescript
import { Mailgent, MailgentApiError } from "@mailgent/sdk";

try {
  await client.mail.send({ to: "test@example.com", subject: "Hi", text: "Hello" });
} catch (e) {
  if (e instanceof MailgentApiError) {
    console.error(e.status);  // HTTP status code
    console.error(e.code);    // API error code
    console.error(e.message); // Human-readable message
  }
}
```

## TypeScript

The SDK exports all request and response types:

```typescript
import type {
  MailgentConfig,
  MessageResponse,
  ThreadResponse,
  ThreadDetailResponse,
  PaginatedMessages,
  PaginatedThreads,
  VaultCredentialType,
  CredentialMetadata,
  CredentialWithData,
  VaultList,
  TotpResponse,
  IdentityResponse,
  ActivityLog,
  PaginatedLogs,
  LogsStatsResponse,
  DidDocument,
} from "@mailgent/sdk";
```

## Links

- [Documentation](https://docs.mailgent.dev)
- [Website](https://mailgent.dev)
- [Console](https://console.mailgent.dev)

## License

MIT
