import { bytesToHex as toHex } from "@noble/hashes/utils";
import { toWif } from "./crypto/wif.js";
import { toAddress } from "./crypto/address.js";
import { addressBalanceReq } from "./api/address/balance.api.js";
import { env } from "./env.js";
import { phraseToPrivKey } from "./crypto/privKey.js";
import { toPubKey } from "./crypto/pubKey.js";
import { Transaction } from "./api/transaction/Transaction.js";

process.stdout.write("CRYPTO-KEYRING" + "\n");
process.stdout.write("type passphrase..." + "\n");

process.stdin.on("data", async (input) => {
  const isTestnet = env.net === "TEST_NET";
  const phrase = input.toString().slice(0, input.length - 1);

  const privKey = phraseToPrivKey(phrase);
  const wif = toWif(privKey, isTestnet);
  const pubKey = toPubKey(privKey, false);
  const address = toAddress(pubKey, isTestnet);
  const addressInfo = await addressBalanceReq(address);

  const transaction = new Transaction({
    inputAddress: "n3GgbqMvS3rYdu5VHhjDN3Cfxtobpeqsnj",
    outputAddress: "mwqncWSnzUzouPZcLQWcLTPuSVq3rSiAAa",
    value: 10000,
  });
  try {
    await transaction.create();
    transaction.sign(pubKey, privKey);
    await transaction.send();
  } catch (error) {
    console.log(error);
  }

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
