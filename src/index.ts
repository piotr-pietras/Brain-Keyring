import { Transaction } from "./utils/Transaction.js";
import { Keys } from "./utils/Keys.js";

process.stdout.write("CRYPTO-KEYRING" + "\n");
process.stdout.write("type passphrase..." + "\n");

process.stdin.on("data", async (input) => {
  const phrase = input.toString().slice(0, -1);
  const keys = new Keys(phrase);
  keys.logInfo();

  const transaction = new Transaction({
    inputAddress: "n3GgbqMvS3rYdu5VHhjDN3Cfxtobpeqsnj",
    outputAddress: "mwqncWSnzUzouPZcLQWcLTPuSVq3rSiAAa",
    value: 10000,
  });
  try {
    await transaction.create();
    transaction.sign(keys);
    await transaction.send();
    console.log("Transaction done correctly!");
  } catch (error) {
    console.log(error);
  }
});
