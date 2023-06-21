import inq from "inquirer";
import { Context } from "../context.js";
import { printWelcome } from "../printable.js";
import { promptWalletMenu } from "./walletMenu.prompt.js";
import { log } from "../../common/log.js";

export const promptSendTransaction = async (context: Context) => {
  console.clear();
  printWelcome();

  const { transaction } = context.wallet;
  const { balance, fees, value } = await transaction.validateSkeleton();

  log("Your TX object was created successfully!");
  log("Check address, value and fees TWICE!");
  log("-------------------------------------------");
  log(`| Current balance: ${balance}`);
  log(`| Output: ${value}`);
  log(`| Fees: ${fees}`);
  log(`| Balance after transaction: ${balance - value - fees}`);
  log("-------------------------------------------");

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
          promptWalletMenu(context, () => log(err));
        }
        promptWalletMenu(context, () => log("Transaction signed!"));
      } else {
        promptWalletMenu(context, () => log("Transaction canceled"));
      }
    });
};
