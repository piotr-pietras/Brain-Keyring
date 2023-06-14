var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
process.stdin.on("data", (input) => __awaiter(void 0, void 0, void 0, function* () {
    const isTestnet = env.net === "TEST_NET";
    const phrase = input.toString().slice(0, input.length - 1);
    const privKey = phraseToPrivKey(phrase);
    const wif = toWif(privKey, isTestnet);
    const pubKey = toPubKey(privKey, false);
    const address = toAddress(pubKey, isTestnet);
    const addressInfo = yield addressBalanceReq(address);
    const transaction = new Transaction({
        inputAddress: "n3GgbqMvS3rYdu5VHhjDN3Cfxtobpeqsnj",
        outputAddress: "mwqncWSnzUzouPZcLQWcLTPuSVq3rSiAAa",
        value: 10000,
    });
    try {
        yield transaction.create();
        transaction.sign(pubKey, privKey);
        yield transaction.send();
    }
    catch (error) {
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
}));
