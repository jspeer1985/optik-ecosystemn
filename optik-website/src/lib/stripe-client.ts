export async function createCheckoutSession(params: {
  tier: string;
  creatorWallet: string;
  tokenName: string;
  tokenSymbol: string;
  liquiditySOL: number;
}) {
  const response = await fetch('/api/payment/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  const data = await response.json();
  return data;
}

export async function redirectToCheckout(sessionId: string) {
  // Redirect to Stripe Checkout
  const stripe = await import('@stripe/stripe-js').then(m => 
    m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  );
  
  if (!stripe) {
    throw new Error('Stripe failed to load');
  }

  const { error } = await stripe.redirectToCheckout({ sessionId });
  
  if (error) {
    throw error;
  }
}
