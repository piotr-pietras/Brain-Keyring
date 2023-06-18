import inq from "inquirer";
import { Context } from "../context.js";
import { promptMainMenu } from "./mainMenu.prompt.js";
import { printWelcome } from "../welcoming.js";
import { createTransaction } from "./createTransaction.prompt.js";
import { log } from "../../common/log.js";

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
          const { privKey, pubKey } = keys.keysHex;
          log("\n-------------------------------------------");
          log(`| Private Key: \n| ${privKey} `);
          log(`| Public Key (uncompressed): \n| ${pubKey}`);
          log("-------------------------------------------\n");
          promptWalletMenu(context, true);
          break;
        case Choices.LOGOUT:
          promptMainMenu(context);
          break;
      }
    });
};
