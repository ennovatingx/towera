import type { Bank, PayoutAccount, PayoutRequest } from '@/types/studio';
import { fetchAllPages, request } from './client';

// Known seam: none of this exists in the current API spec. Paystack's bank-list
// and resolve-account endpoints require a secret key on every request, so they
// can never be called directly from the frontend — that key would be visible to
// anyone via browser dev tools. This assumes a Django proxy sits in front of
// Paystack (GET /api/payouts/banks/, POST /api/payouts/resolve-account/), plus a
// real payout-account / payout-request data model with a pending → in_review →
// approved status workflow. All of it is speculative until the backend adds it.

export async function listBanks(): Promise<Bank[]> {
  return request<Bank[]>('/api/payouts/banks/');
}

export interface ResolveAccountInput {
  accountNumber: string;
  bankCode: string;
}

export interface ResolvedAccount {
  accountNumber: string;
  accountName: string;
}

export async function resolveAccount(input: ResolveAccountInput): Promise<ResolvedAccount> {
  const res = await request<{ account_number: string; account_name: string }>('/api/payouts/resolve-account/', {
    method: 'POST',
    body: JSON.stringify({ account_number: input.accountNumber, bank_code: input.bankCode }),
  });
  return { accountNumber: res.account_number, accountName: res.account_name };
}

export async function listPayoutAccounts(): Promise<PayoutAccount[]> {
  return fetchAllPages<PayoutAccount>('/api/payouts/accounts/');
}

export interface CreatePayoutAccountInput {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export async function createPayoutAccount(input: CreatePayoutAccountInput): Promise<PayoutAccount> {
  return request<PayoutAccount>('/api/payouts/accounts/', {
    method: 'POST',
    body: JSON.stringify({
      bank_code: input.bankCode,
      bank_name: input.bankName,
      account_number: input.accountNumber,
      account_name: input.accountName,
    }),
  });
}

export async function listPayoutRequests(): Promise<PayoutRequest[]> {
  return fetchAllPages<PayoutRequest>('/api/payouts/requests/');
}

export interface CreatePayoutRequestInput {
  amount: number;
  payoutAccountId: number;
}

export async function createPayoutRequest(input: CreatePayoutRequestInput): Promise<PayoutRequest> {
  return request<PayoutRequest>('/api/payouts/requests/', {
    method: 'POST',
    body: JSON.stringify({ amount: input.amount, payout_account: input.payoutAccountId }),
  });
}
