import Stripe from "stripe";

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { typescript: true });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
});

export async function createPaymentIntent(amountCents: number, taskId: string) {
  return getStripe().paymentIntents.create({
    amount: amountCents,
    currency: "usd",
    metadata: { taskId },
  });
}

export async function releasePayment(
  stripePaymentIntentId: string,
  workerStripeAccountId: string,
  amountCents: number,
  platformFeeCents: number
) {
  const workerAmount = amountCents - platformFeeCents;
  return getStripe().transfers.create({
    amount: workerAmount,
    currency: "usd",
    destination: workerStripeAccountId,
    source_transaction: stripePaymentIntentId,
  });
}

export async function onboardWorker(userId: string, email: string) {
  const account = await getStripe().accounts.create({
    type: "express",
    email,
    metadata: { userId },
  });

  const accountLink = await getStripe().accountLinks.create({
    account: account.id,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?stripe=refresh`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?stripe=success`,
    type: "account_onboarding",
  });

  return { accountId: account.id, url: accountLink.url };
}

export async function getConnectStatus(accountId: string) {
  const account = await getStripe().accounts.retrieve(accountId);
  return {
    payoutsEnabled: account.payouts_enabled,
    chargesEnabled: account.charges_enabled,
  };
}
