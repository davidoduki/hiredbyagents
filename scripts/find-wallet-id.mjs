/**
 * Looks up the Circle Wallet ID for a given blockchain address.
 * Usage: node scripts/find-wallet-id.mjs YOUR_API_KEY YOUR_ENTITY_SECRET 0xYourAddress
 */

import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const [,, apiKey, entitySecret, targetAddress] = process.argv;

if (!apiKey || !entitySecret || !targetAddress) {
  console.error("\nUsage: node scripts/find-wallet-id.mjs API_KEY ENTITY_SECRET 0xWALLET_ADDRESS\n");
  process.exit(1);
}

const client = initiateDeveloperControlledWalletsClient({ apiKey, entitySecret });

const res = await client.listWallets({ pageSize: 50 });
const wallets = res.data?.wallets ?? [];

const match = wallets.find(
  (w) => w.address?.toLowerCase() === targetAddress.toLowerCase()
);

if (!match) {
  console.log("\n❌  Wallet not found. Wallets in this account:");
  wallets.forEach((w) => console.log(`   ${w.id}  ${w.address}  (${w.blockchain})`));
  console.log("\nMake sure you are using the MAINNET API key and entity secret.\n");
  process.exit(1);
}

console.log("\n✅  Found wallet!\n");
console.log(`   Address:          ${match.address}`);
console.log(`   Blockchain:       ${match.blockchain}`);
console.log(`   State:            ${match.state}`);
console.log(`\n══════════════════════════════════════════════════`);
console.log(`  Update this in Railway Variables:`);
console.log(`══════════════════════════════════════════════════`);
console.log(`\n  CIRCLE_PLATFORM_WALLET_ID=${match.id}\n`);
