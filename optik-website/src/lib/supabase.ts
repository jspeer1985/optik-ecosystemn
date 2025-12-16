import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Token {
  id: string;
  mint_address: string;
  creator_wallet: string;
  name: string;
  symbol: string;
  description: string;
  image_url?: string;
  website_url?: string;
  twitter_url?: string;
  telegram_url?: string;
  decimals: number;
  supply: number;
  transaction_signature: string;
  metadata: any;
  status: 'created' | 'deploying' | 'deployed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  stripe_session_id: string;
  stripe_payment_intent: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  customer_email?: string;
  token_name?: string;
  token_symbol?: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  wallet_address: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

// Database functions
export async function createToken(tokenData: Partial<Token>) {
  const { data, error } = await supabase
    .from('tokens')
    .insert(tokenData)
    .select()
    .single();

  if (error) {
    console.error('Error creating token:', error);
    throw error;
  }

  return data;
}

export async function getTokensByCreator(walletAddress: string) {
  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .eq('creator_wallet', walletAddress)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tokens:', error);
    throw error;
  }

  return data;
}

export async function getTokenByMintAddress(mintAddress: string) {
  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .eq('mint_address', mintAddress)
    .single();

  if (error) {
    console.error('Error fetching token:', error);
    throw error;
  }

  return data;
}

export async function updateTokenStatus(id: string, status: Token['status'], transactionSignature?: string) {
  const updateData: any = { 
    status,
    updated_at: new Date().toISOString(),
  };

  if (transactionSignature) {
    updateData.transaction_signature = transactionSignature;
  }

  const { data, error } = await supabase
    .from('tokens')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating token status:', error);
    throw error;
  }

  return data;
}

export async function createPayment(paymentData: Partial<Payment>) {
  const { data, error } = await supabase
    .from('payments')
    .insert(paymentData)
    .select()
    .single();

  if (error) {
    console.error('Error creating payment:', error);
    throw error;
  }

  return data;
}

export async function getPaymentsByUser(customerEmail: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('customer_email', customerEmail)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }

  return data;
}

export async function updatePaymentStatus(sessionId: string, status: Payment['status']) {
  const { data, error } = await supabase
    .from('payments')
    .update({ 
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_session_id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }

  return data;
}

export async function getOrCreateUser(walletAddress: string, email?: string) {
  // First try to find existing user
  let { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (error && error.code === 'PGRST116') {
    // User doesn't exist, create new one
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        wallet_address: walletAddress,
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating user:', createError);
      throw createError;
    }

    user = newUser;
  } else if (error) {
    console.error('Error fetching user:', error);
    throw error;
  }

  return user;
}

// Real-time subscriptions
export function subscribeToTokenUpdates(walletAddress: string, callback: (token: Token) => void) {
  return supabase
    .channel('token-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tokens',
        filter: `creator_wallet=eq.${walletAddress}`,
      },
      (payload) => {
        callback(payload.new as Token);
      }
    )
    .subscribe();
}

export function subscribeToPaymentUpdates(customerEmail: string, callback: (payment: Payment) => void) {
  return supabase
    .channel('payment-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'payments',
        filter: `customer_email=eq.${customerEmail}`,
      },
      (payload) => {
        callback(payload.new as Payment);
      }
    )
    .subscribe();
}