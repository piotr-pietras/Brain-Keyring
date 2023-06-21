import inq from "inquirer";
import { Context } from "../context.js";
import { promptMainMenu } from "./mainMenu.prompt.js";
import { printKeys, printWelcome } from "../printable.js";
import { createTransaction } from "./createTransaction.prompt.js";

enum Choices {
  TRANSACTION = "Make transaction",
  KEYS = "Show your keys (unsafe)",
  LOGOUT = "Logout",
}

export const promptWalletMenu = (context: Context, before?: () => void) => {
  console.clear();
  printWelcome();
  before && before();

  const { blockchain, net, keys } = context.wallet;
  inq
    .prompt<{ wallet: Choices }>([
      {
        name: "wallet",
        message: `${blockchain}-${net} => address: ${keys.addressHex}`,
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
          printKeys(keys);
          promptWalletMenu(context, () => printKeys(keys));
          break;
        case Choices.LOGOUT:
          promptMainMenu(context);
          break;
      }
    });
};
