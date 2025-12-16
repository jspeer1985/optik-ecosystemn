// set-metadata.js
const fs = require("fs");
const {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");

const mpl = require("@metaplex-foundation/mpl-token-metadata"); // CommonJS import
