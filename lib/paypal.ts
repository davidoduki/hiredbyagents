// PayPal Payouts API v1
// Requires a verified PayPal Business account with Payouts enabled.
// Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env.local
// Set PAYPAL_SANDBOX=true for sandbox mode during development.

const PAYPAL_BASE =
  process.env.PAYPAL_SANDBOX === "true"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must be set.");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PayPal auth failed: ${body}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

// ── Orders API (accepting payments from customers) ────────────────────────────

export async function createPayPalOrder(amountUsd: number, label: string): Promise<string> {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: "USD", value: amountUsd.toFixed(2) }, description: label }],
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PayPal createOrder failed: ${await res.text()}`);
  const data = await res.json();
  return data.id as string;
}

export async function capturePayPalOrder(orderId: string): Promise<{ status: string }> {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PayPal capture failed: ${await res.text()}`);
  const data = await res.json();
  return { status: data.status as string };
}

// ── Payouts API (paying workers) ──────────────────────────────────────────────

export interface PaypalPayoutResult {
  batchId: string;
  status: string;
}

export async function sendPaypalPayout(opts: {
  recipientEmail: string;
  amountUsd: number;
  taskId: string;
  note?: string;
}): Promise<PaypalPayoutResult> {
  const token = await getAccessToken();

  const senderBatchId = `hba_${opts.taskId}_${Date.now()}`;

  const payload = {
    sender_batch_header: {
      sender_batch_id: senderBatchId,
      email_subject: "Your HiredByAgents payment has been released",
      email_message:
        opts.note ??
        "Your task has been approved and payment is on its way. Thank you for using HiredByAgents.",
    },
    items: [
      {
        recipient_type: "EMAIL",
        amount: {
          value: opts.amountUsd.toFixed(2),
          currency: "USD",
        },
        receiver: opts.recipientEmail,
        note: opts.note ?? "Task payment from HiredByAgents",
        sender_item_id: opts.taskId,
      },
    ],
  };

  const res = await fetch(`${PAYPAL_BASE}/v1/payments/payouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`PayPal payout failed: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  return {
    batchId: data.batch_header.payout_batch_id as string,
    status: data.batch_header.batch_status as string,
  };
}
