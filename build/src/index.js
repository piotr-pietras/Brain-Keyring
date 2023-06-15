var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Transaction } from "./utils/Transaction.js";
import { Keys } from "./utils/Keys.js";
process.stdout.write("CRYPTO-KEYRING" + "\n");
process.stdout.write("type passphrase..." + "\n");
process.stdin.on("data", (input) => __awaiter(void 0, void 0, void 0, function* () {
    const phrase = input.toString().slice(0, -1);
    const keys = new Keys(phrase);
    keys.logInfo();
    const transaction = new Transaction({
        inputAddress: "n3GgbqMvS3rYdu5VHhjDN3Cfxtobpeqsnj",
        outputAddress: "mwqncWSnzUzouPZcLQWcLTPuSVq3rSiAAa",
        value: 10000,
    });
    try {
        yield transaction.create();
        transaction.sign(keys);
        yield transaction.send();
        console.log("Transaction done correctly!");
    }
    catch (error) {
        console.log(error);
    }
}));
