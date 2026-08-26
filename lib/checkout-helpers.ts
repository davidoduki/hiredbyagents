import Stripe from "stripe";

export const TIERS = {
  BASIC:    { amountCents: 4900,  label: "Basic Task — Human Verification" },
  STANDARD: { amountCents: 9900,  label: "Standard Task — Human Inspection & Report" },
  PREMIUM:  { amountCents: 19900, label: "Premium Task — Specialist Human Execution" },
} as const;

export type TierKey = keyof typeof TIERS;

let _stripe: Stripe | null = null;

export function getStripeInstance(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { typescript: true });
  }
  return _stripe;
}
