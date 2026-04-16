/**
 * circle-mainnet-setup.mjs
 * Run once to configure Circle Programmable Wallets on Base mainnet.
 * Usage: node scripts/circle-mainnet-setup.mjs YOUR_LIVE_API_KEY
 */

import {
  initiateDeveloperControlledWalletsClient,
  registerEntitySecretCiphertext,
  generateEntitySecret,
} from "@circle-fin/developer-controlled-wallets";
import { randomBytes } from "crypto";

const apiKey = process.argv[2];
if (!apiKey || apiKey.length < 10) {
  console.error("\n❌  Usage: node scripts/circle-mainnet-setup.mjs YOUR_LIVE_API_KEY\n");
  process.exit(1);
}

console.log("\n🔐  Step 1 — Generating entity secret...");
const entitySecretResult = generateEntitySecret();

// generateEntitySecret prints instructions and returns the hex secret
// Extract the 64-char hex from its output
const secretMatch = entitySecretResult?.match
  ? entitySecretResult.match(/[0-9a-f]{64}/i)
  : null;

// If the SDK returned the secret directly as a string use it, otherwise parse
let entitySecret;
if (typeof entitySecretResult === "string" && /^[0-9a-f]{64}$/i.test(entitySecretResult.trim())) {
  entitySecret = entitySecretResult.trim();
} else if (secretMatch) {
  entitySecret = secretMatch[0];
} else {
  // fallback: generate ourselves
  entitySecret = randomBytes(32).toString("hex");
}

console.log("   Entity secret (SAVE THIS NOW — you cannot recover it later):");
console.log(`   ${entitySecret}\n`);

console.log("🔗  Step 2 — Registering entity secret with Circle...");
let recoveryFilePath;
try {
  await registerEntitySecretCiphertext({
    apiKey,
    entitySecret,
    recoveryFileDownloadPath: ".",   // saves a recovery file in current dir
  });
  recoveryFilePath = "./recovery_file.dat";
  console.log("   ✓ Registered. Recovery file saved to: ./recovery_file.dat");
} catch (err) {
  // If already registered for this API key that's fine
  const msg = String(err?.message ?? err);
  if (msg.includes("already") || msg.includes("exists") || msg.includes("409")) {
    console.log("   ✓ Entity secret already registered for this API key — continuing.");
  } else {
    console.error("   ❌ Registration failed:", msg);
    process.exit(1);
  }
}

console.log("\n👛  Step 3 — Creating platform wallet set...");
const client = initiateDeveloperControlledWalletsClient({ apiKey, entitySecret });

const idKey1 = randomBytes(16).toString("hex");
const wsRes = await client.createWalletSet({
  idempotencyKey: idKey1,
  name: "HiredByAgents Platform",
});
const walletSetId = wsRes.data?.walletSet?.id;
if (!walletSetId) {
  console.error("   ❌ Failed to create wallet set:", wsRes);
  process.exit(1);
}
console.log(`   ✓ Wallet set created: ${walletSetId}`);

console.log("\n💼  Step 4 — Creating platform wallet on Base mainnet...");
const idKey2 = randomBytes(16).toString("hex");
const wRes = await client.createWallets({
  idempotencyKey: idKey2,
  blockchains: ["BASE"],
  count: 1,
  walletSetId,
});
const wallet = wRes.data?.wallets?.[0];
if (!wallet?.id) {
  console.error("   ❌ Failed to create wallet:", wRes);
  process.exit(1);
}
console.log(`   ✓ Wallet created: ${wallet.id}`);
console.log(`   ✓ Wallet address: ${wallet.address}`);

console.log("\n\n══════════════════════════════════════════════════════════");
console.log("  ✅  SETUP COMPLETE — copy these into Railway Variables:");
console.log("══════════════════════════════════════════════════════════");
console.log(`\nCIRCLE_API_KEY=${apiKey}`);
console.log(`CIRCLE_ENTITY_SECRET=${entitySecret}`);
console.log(`CIRCLE_WALLET_SET_ID=${walletSetId}`);
console.log(`CIRCLE_PLATFORM_WALLET_ID=${wallet.id}`);
console.log(`\n  Fund your wallet by sending USDC (Base network) to:`);
console.log(`  ${wallet.address}`);
console.log("\n══════════════════════════════════════════════════════════\n");
console.log("⚠️   Also save the entity secret somewhere OFFLINE (password manager).");
console.log("    If you lose it you will lose access to the wallet permanently.\n");
