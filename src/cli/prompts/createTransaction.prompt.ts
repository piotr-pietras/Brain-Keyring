import inq from "inquirer";
import { Context } from "../context.js";
import { boxedLog, printWelcome } from "../printable.js";
import { Transaction } from "../../utils/Transaction.js";
import { TxSeed } from "../../utils/Transaction.types.js";
import { promptSendTransaction } from "./sendTransaction.prompt.js";
import { promptWalletMenu } from "./walletMenu.prompt.js";

export const promptCreateTransaction = (context: Context) => {
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
      const { keys } = context.wallet;
      const txSeed: TxSeed = {
        inputAddress: keys.addressHex,
        outputAddress: output,
        value: parseInt(value),
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
