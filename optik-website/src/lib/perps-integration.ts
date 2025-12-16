import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { OptiKPerpetualsIntegration } from "../lib/perps-integration";
import fs from "fs";

async function main() {
  // Connect to devnet
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
  // Load wallet
  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(
      process.env.HOME + "/.config/solana/id.json",
      "utf-8"
    )))
  );
  
  const wallet = new anchor.Wallet(walletKeypair);
  
  // Get OPTIK mint from env
  const optikMint = new PublicKey(process.env.NEXT_PUBLIC_OPTIKCOIN_MINT!);
  const programId = new PublicKey(process.env.NEXT_PUBLIC_PERPS_PROGRAM_ID!);
  
  // Initialize perpetuals
  const perps = new OptiKPerpetualsIntegration({
    connection,
    wallet,
    optikMint,
    programId
  });
  
  console.log("🚀 Initializing perpetuals market...");
  const marketPda = await perps.initializeMarket();
  console.log("✅ Market initialized:", marketPda.toBase58());
  
  // Update .env.local
  const envContent = fs.readFileSync(".env.local", "utf-8");
  const updatedEnv = envContent.replace(
    /NEXT_PUBLIC_PERPS_MARKET_PDA=.*/,
    `NEXT_PUBLIC_PERPS_MARKET_PDA=${marketPda.toBase58()}`
  );
  fs.writeFileSync(".env.local", updatedEnv);
  
  console.log("✅ Environment updated");
  
  // Initialize competitions
  console.log("\n🏆 Initializing competitions...");
  
  const now = new Date();
  const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  // Volume competition
  const volumeComp = await perps.initializeCompetition(
    marketPda,
    now,
    weekLater,
    50000,
    0
  );
  console.log("✅ Volume competition:", volumeComp.toBase58());
  
  // PnL competition
  const pnlComp = await perps.initializeCompetition(
    marketPda,
    now,
    weekLater,
    100000,
    1
  );
  console.log("✅ PnL competition:", pnlComp.toBase58());
  
  // Streak competition
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const streakComp = await perps.initializeCompetition(
    marketPda,
    now,
    tomorrow,
    25000,
    2
  );
  console.log("✅ Streak competition:", streakComp.toBase58());
  
  console.log("\n🎉 Setup complete!");
  console.log("\nNext steps:");
  console.log("1. Update your frontend with the new market PDA");
  console.log("2. Fund the insurance vault");
  console.log("3. Start the development server: npm run dev");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });