import inq from "inquirer";
import { Context } from "../context.js";
import { printWelcome } from "../printable.js";
import { Transaction } from "../../utils/Transaction.js";
import { TXSeed } from "../../utils/Transaction.types.js";
import { promptSendTransaction } from "./sendTransaction.prompt.js";
import { log } from "../../common/log.js";
import { promptWalletMenu } from "./walletMenu.prompt.js";

export const createTransaction = (context: Context) => {
  console.clear();
  printWelcome();

  inq
    .prompt<{ output: string; value: string }>([
      {
        name: "output",
        message: "Creating transaction \n1)Paste your output address",
        type: "input",
      },
      {
        name: "value",
        message: "How much do you want to send (in satoshi)",
        type: "input",
      },
    ])
    .then(async ({ output, value }) => {
      log("Please wait... Block Cypher creates for you TX object to sign.");
      const { keys, net } = context.wallet;
      const txSeed: TXSeed = {
        inputAddress: keys.addressHex,
        outputAddress: output,
        value: parseInt(value),
      };
      const transaction = new Transaction(txSeed, net);
      try {
        await transaction.create(context.wallet.keys);
        context.wallet.transaction = transaction;
        promptSendTransaction(context);
      } catch (err) {
        promptWalletMenu(context, () => log(err));
      }
    });
};
