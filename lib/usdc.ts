import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import { randomUUID } from "crypto";

function getClient() {
  const apiKey = process.env.CIRCLE_API_KEY;
  const entitySecret = process.env.CIRCLE_ENTITY_SECRET;
  if (!apiKey || !entitySecret) {
    throw new Error("Circle credentials not configured (CIRCLE_API_KEY / CIRCLE_ENTITY_SECRET missing)");
  }
  return initiateDeveloperControlledWalletsClient({ apiKey, entitySecret });
}

// Cache token ID for the lifetime of the process (avoids repeat balance lookups)
let cachedUsdcTokenId: string | null = null;

async function getUsdcTokenId(): Promise<string> {
  if (cachedUsdcTokenId) return cachedUsdcTokenId;

  const client = getClient();
  const walletId = process.env.CIRCLE_PLATFORM_WALLET_ID;
  if (!walletId) throw new Error("CIRCLE_PLATFORM_WALLET_ID not configured");

  const response = await client.getWalletTokenBalance({ id: walletId });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const balances: any[] = response.data?.tokenBalances ?? [];

  const usdc = balances.find(
    (b) => b.token?.symbol === "USDC" || b.token?.name?.toLowerCase().includes("usd coin")
  );

  if (!usdc?.token?.id) {
    const available = balances.map((b) => b.token?.symbol ?? "unknown").join(", ");
    throw new Error(
      `USDC not found in platform wallet. Available tokens: ${available || "none"}. ` +
        `Fund the wallet at https://app.circle.com before releasing payments.`
    );
  }

  cachedUsdcTokenId = usdc.token.id as string;
  return cachedUsdcTokenId;
}

export interface UsdcPayoutResult {
  transactionId: string;
  state: string;
}

export async function sendUsdcPayout(opts: {
  recipientAddress: string;
  amountUsd: number;
  taskId: string;
}): Promise<UsdcPayoutResult> {
  const client = getClient();
  const walletId = process.env.CIRCLE_PLATFORM_WALLET_ID;
  if (!walletId) throw new Error("CIRCLE_PLATFORM_WALLET_ID not configured");

  if (opts.amountUsd <= 0) throw new Error("Amount must be greater than 0");

  const tokenId = await getUsdcTokenId();

  const response = await client.createTransaction({
    walletId,
    tokenId,
    destinationAddress: opts.recipientAddress,
    amount: [opts.amountUsd.toFixed(6)],
    fee: { type: "level", config: { feeLevel: "MEDIUM" } },
    idempotencyKey: randomUUID(),
    refId: `task-${opts.taskId}`,
  });

  const tx = response.data;
  if (!tx?.id) throw new Error("Circle returned no transaction ID");

  return { transactionId: tx.id, state: tx.state ?? "INITIATED" };
}

/** Returns the platform wallet's USDC balance (0 if wallet is unfunded or Circle creds are missing). */
export async function getPlatformUsdcBalance(): Promise<number> {
  try {
    const client = getClient();
    const walletId = process.env.CIRCLE_PLATFORM_WALLET_ID;
    if (!walletId) return 0;

    const response = await client.getWalletTokenBalance({ id: walletId });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const balances: any[] = response.data?.tokenBalances ?? [];
    const usdc = balances.find(
      (b) => b.token?.symbol === "USDC" || b.token?.name?.toLowerCase().includes("usd coin")
    );
    return usdc ? parseFloat(usdc.amount ?? "0") : 0;
  } catch {
    return 0;
  }
}

/** Requests free testnet USDC + native gas into the platform wallet (testnet/sandbox only). */
export async function requestTestnetUsdcForPlatformWallet(): Promise<{ address: string }> {
  const client = getClient();
  const walletId = process.env.CIRCLE_PLATFORM_WALLET_ID;
  if (!walletId) throw new Error("CIRCLE_PLATFORM_WALLET_ID not configured");

  const walletRes = await client.getWallet({ id: walletId });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const address = (walletRes.data as any)?.wallet?.address as string | undefined;
  if (!address) throw new Error("Could not retrieve wallet address from Circle");

  await client.requestTestnetTokens({
    address,
    blockchain: "BASE-SEPOLIA",
    usdc: true,
    native: true,
  });

  return { address };
}
