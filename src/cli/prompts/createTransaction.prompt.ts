import inq from "inquirer";
import { Context } from "../context.js";
import { boxedLog, printWelcome } from "../printable.js";
import { Transaction } from "../../utils/Transaction.js";
import { TxSeed } from "../../utils/Transaction.types.js";
import { promptSendTransaction } from "./sendTransaction.prompt.js";
import { log } from "../log.js";
import { promptWalletMenu } from "./walletMenu.prompt.js";

export const promptCreateTransaction = (context: Context) => {
  console.clear();
  printWelcome();

  inq
    .prompt<{ destination: string; amount: string }>([
      {
        name: "destination",
        message: "Paste your output address",
        type: "input",
      },
      {
        name: "amount",
        message: "How much do you want to send",
        type: "input",
      },
    ])
    .then(async ({ destination, amount }) => {
      const { keys } = context.wallet;
      const txSeed: TxSeed = {
        destination,
        amount,
      };
      const transaction = new Transaction(txSeed, keys);
      try {
        await transaction.create();
        context.wallet.transaction = transaction;
        promptSendTransaction(context);
      } catch (err) {
        promptWalletMenu(context, () => boxedLog(err));
      }
    });
};
