import inq from "inquirer";
import { Context } from "../context.js";
import { printWelcome } from "../welcoming.js";
import { promptWalletMenu } from "./walletMenu.prompt.js";
import { log } from "../../common/log.js";

export const promptSendTransaction = (context: Context) => {
  console.clear();
  printWelcome();

  //TX skeleton needs to be validated to avoid any malicious responses

  const { txSekeleton } = context.wallet.transaction;
  const { keys } = context.wallet;

  log("Your TX object was created successfully!");
  log("Check address, value and fees TWICE!");
  log("-------------------------------------------");
  log(`| Output address: HERE IS ADDRESS`);
  log(`| Value: HERE IS MONAY YOU SPEND`);
  log(`| Fees: ${txSekeleton.tx.fees}`);
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
          context.wallet.transaction.sign(keys);
          await context.wallet.transaction.send();
          log("Smoooth. Transaction signed! Check block explorer.");
        } catch (err) {
          log(err);
        }
        promptWalletMenu(context, true);
      } else {
        log("Transaction canceled");
      }
    });
};
