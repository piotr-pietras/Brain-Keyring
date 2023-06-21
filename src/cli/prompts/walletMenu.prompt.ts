import inq from "inquirer";
import { Context } from "../context.js";
import { promptMainMenu } from "./mainMenu.prompt.js";
import { printBalance, printKeys, printWelcome } from "../printable.js";
import { createTransaction } from "./createTransaction.prompt.js";
import { checkBalance } from "../../api/balance/checkBalance.api.js";
import { getParams } from "../params.js";
import { log } from "../../common/log.js";

enum Choices {
  TRANSACTION = "Make transaction",
  BALANCE = "Check balance",
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
    .then(async ({ wallet }) => {
      const { keys } = context.wallet;
      switch (wallet) {
        case Choices.TRANSACTION:
          createTransaction(context);
          break;
        case Choices.BALANCE:
          const balance = await keys.balance();
          promptWalletMenu(context, () => printBalance(balance));
          break;
        case Choices.KEYS:
          promptWalletMenu(context, () => printKeys(keys));
          break;
        case Choices.LOGOUT:
          promptMainMenu(context);
          break;
      }
    });
};
