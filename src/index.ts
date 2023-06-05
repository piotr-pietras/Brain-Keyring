import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex as toHex } from "@noble/hashes/utils";
import { getPublicKey } from "@noble/secp256k1";
import { toWif } from "./wif.js";
import { toAddress } from "./address.js";

process.stdout.write("CRYPTO-KEYRING" + "\n");
process.stdout.write("type passphrase..." + "\n");

process.stdin.on("data", (input) => {
  //Remove new line from input
  const phrase = input.toString().slice(0, input.length - 1);

  const privKey = sha256(phrase);
  const wif = toWif(privKey, true);
  const pubKey = getPublicKey(privKey, false);
  const address = toAddress(pubKey, true);

  process.stdout.write("Private Key: ");
  process.stdout.write(toHex(privKey) + "\n");
  process.stdout.write("Private Key (WIF): ");
  process.stdout.write(wif + "\n");
  process.stdout.write("Public Key: ");
  process.stdout.write(toHex(pubKey) + "\n");
  process.stdout.write("Address: ");
  process.stdout.write(address + "\n");
});
