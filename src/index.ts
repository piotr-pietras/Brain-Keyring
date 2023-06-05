import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex as toHex } from "@noble/hashes/utils";
import { getPublicKey } from "@noble/secp256k1";
import { toWif } from "./wif.js";
import { toAddress } from "./address.js";
import { addressBalanceReq } from "./https.js";
import { env } from "./env.js";

process.stdout.write("CRYPTO-KEYRING" + "\n");
process.stdout.write("type passphrase..." + "\n");

process.stdin.on("data", async (input) => {
  const isTestnet = env.net === "TEST_NET";
  const phrase = input.toString().slice(0, input.length - 1);

  const privKey = sha256(phrase);
  const wif = toWif(privKey, isTestnet);
  const pubKey = getPublicKey(privKey, false);
  const address = toAddress(pubKey, isTestnet);
  const addressInfo = await addressBalanceReq(address);

  process.stdout.write("Private Key: ");
  process.stdout.write(toHex(privKey) + "\n");
  process.stdout.write("Private Key (WIF): ");
  process.stdout.write(wif + "\n");
  process.stdout.write("Public Key: ");
  process.stdout.write(toHex(pubKey) + "\n");
  process.stdout.write("Address: ");
  process.stdout.write(address + "\n");
  process.stdout.write("Balance: ");
  process.stdout.write(addressInfo.balance + "\n");
});
