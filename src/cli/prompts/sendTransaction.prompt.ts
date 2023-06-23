import inq from "inquirer";
import { Context } from "../context.js";
import { boxedLog, printTransactionInfo, printWelcome } from "../printable.js";
import { promptWalletMenu } from "./walletMenu.prompt.js";

export const promptSendTransaction = async (context: Context) => {
  console.clear();
  printWelcome();

  try {
    const { transaction } = context.wallet;
    const validatedInfo = await transaction.validateSkeleton();
    printTransactionInfo(validatedInfo);

    inq
      .prompt<{ confirm: boolean }>([
        {
          name: "confirm",
          message: "Are you sure to sign this transaction?",
          type: "confirm",
        },
      ])
      .then(async ({ confirm }) => {
        if (confirm) {
          try {
            context.wallet.transaction.sign();
            await context.wallet.transaction.send();
          } catch (err) {
            promptWalletMenu(context, () => boxedLog(err));
          }
          promptWalletMenu(context, () => boxedLog("Transaction signed!"));
        } else {
          promptWalletMenu(context, () => boxedLog("Transaction canceled"));
        }
      });
  } catch (err) {
    promptWalletMenu(context, () => boxedLog(err));
  }
};
