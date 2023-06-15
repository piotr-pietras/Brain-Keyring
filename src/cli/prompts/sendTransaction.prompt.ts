import inq from "inquirer";
import { Context } from "../context.js";
import { printWelcome } from "../welcoming.js";
import { promptWalletMenu } from "./walletMenu.prompt.js";

export const promptSendTransaction = (context: Context) => {
  console.clear();
  printWelcome();

  //TX skeleton needs to be validated to avoid any malicious responses

  const { txSekeleton } = context.wallet.transaction;
  const { keys } = context.wallet;

  console.log("Your TX object was created successfully!");
  console.log("Check address, value and fees TWICE!");
  console.log("-------------------------------------------");
  console.log(`| Output address: HERE IS ADDRESS`);
  console.log(`| Value: HERE IS MONAY YOU SPEND`);
  console.log(`| Fees: ${txSekeleton.tx.fees}`);
  console.log("-------------------------------------------");

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
        } catch (err) {
          console.log(err);
        }
        console.log("Smoooth. Transaction signed! Check block explorer.");
        promptWalletMenu(context, true);
      } else {
        console.log("Transaction canceled");
      }
    });
};
