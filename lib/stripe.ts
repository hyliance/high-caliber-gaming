import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

export const PLATFORM_FEE_PCT = 7; // 7% default wager fee
export const COACHING_FEE_PCT = 17; // 17% default coaching fee
export const MIN_WITHDRAWAL_CENTS = 1000; // $10 minimum withdrawal

export async function createStripeCustomer(email: string, name: string) {
  return stripe.customers.create({ email, name });
}

export async function createPaymentIntent(
  amountCents: number,
  customerId: string,
  metadata?: Record<string, string>
) {
  return stripe.paymentIntents.create({
    amount: amountCents,
    currency: "usd",
    customer: customerId,
    metadata,
    automatic_payment_methods: { enabled: true },
  });
}

export async function createConnectAccount(email: string) {
  return stripe.accounts.create({
    type: "express",
    country: "US",
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
}

export async function transferToCoach(
  amountCents: number,
  stripeAccountId: string,
  metadata?: Record<string, string>
) {
  return stripe.transfers.create({
    amount: amountCents,
    currency: "usd",
    destination: stripeAccountId,
    metadata,
  });
}
