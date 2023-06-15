import inq from "inquirer";
import { Context } from "../context.js";
import { promptMainMenu } from "./mainMenu.prompt.js";
import { printWelcome } from "../welcoming.js";
import { createTransaction } from "./createTransaction.prompt.js";

enum Choices {
  TRANSACTION = "Make transaction",
  KEYS = "Show your keys (unsafe)",
  LOGOUT = "Logout",
}

export const promptWalletMenu = (context: Context, skipWelcome?: boolean) => {
  if (!skipWelcome) {
    console.clear();
    printWelcome();
  }

  if (!context.wallet) throw "Wallet is not initialized";
  const { blockchain, net, keys } = context.wallet;
  inq
    .prompt<{ wallet: Choices }>([
      {
        name: "wallet",
        message: `${blockchain}-${net} => address: ${keys.address}`,
        type: "list",
        choices: Object.values(Choices),
      },
    ])
    .then(({ wallet }) => {
      switch (wallet) {
        case Choices.TRANSACTION:
          createTransaction(context);
          break;
        case Choices.KEYS:
          keys.logKeys();
          promptWalletMenu(context, true);
          break;
        case Choices.LOGOUT:
          promptMainMenu(context);
          break;
      }
    });
};
