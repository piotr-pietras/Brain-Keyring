import inq from "inquirer";
import { Context } from "../context.js";
import { promptMainMenu } from "./mainMenu.prompt.js";
import {
  boxedLog,
  printBalance,
  printKeys,
  printWelcome,
} from "../printable.js";
import { promptCreateTransaction } from "./createTransaction.prompt.js";
import { Blockchains } from "../../common/blockchain.types.js";

enum Choices {
  TRANSACTION = "Make transaction",
  BALANCE = "Check balance",
  KEYS = "Show your keys (unsafe)",
  LOGOUT = "Logout",
}

enum EthChoices {
  ERC20 = "Call ERC20 method",
}

export const promptWalletMenu = (context: Context, before?: () => void) => {
  console.clear();
  printWelcome();
  before && before();

  const { keys } = context.wallet;
  const { blockchain, net } = keys;
  const choices = [
    ...(keys.blockchain === Blockchains.ETH ? Object.values(EthChoices) : []),
    ...Object.values(Choices),
  ];

  inq
    .prompt<{ wallet: Choices | EthChoices }>([
      {
        name: "wallet",
        message: `${blockchain}-${net} => address: ${keys.addressHex}`,
        type: "list",
        choices,
      },
    ])
    .then(async ({ wallet }) => {
      const { keys } = context.wallet;
      switch (wallet) {
        case EthChoices.ERC20:
          break;
        case Choices.TRANSACTION:
          promptCreateTransaction(context);
          break;
        case Choices.BALANCE:
          try {
            const balance = await keys.balance();
            promptWalletMenu(context, () => printBalance(balance));
          } catch (err) {
            promptWalletMenu(context, () => boxedLog(err));
          }
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
