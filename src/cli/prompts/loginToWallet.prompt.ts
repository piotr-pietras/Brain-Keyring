import inq from "inquirer";
import { Context } from "../context.js";
import { Blockchains, Net } from "../../common/blockchain.types.js";
import { KeysBTC } from "../../utils/KeysBTC.js";
import { promptWalletMenu } from "./walletMenu.prompt.js";
import { printWelcome } from "../printable.js";

enum ChoicesBlockchain {
  BTC = Blockchains.BTC,
}

enum ChoicesNet {
  MAIN = Net.MAIN,
  TEST = Net.TEST,
}

export const promptLoginToWallet = (context: Context) => {
  console.clear();
  printWelcome();

  inq
    .prompt<{ blockchain: ChoicesBlockchain; net: ChoicesNet; phrase: string }>(
      [
        {
          name: "blockchain",
          message: "Login to a wallet: \n1)Choose blockchain wallet",
          type: "list",
          choices: Object.values(ChoicesBlockchain),
        },
        {
          name: "net",
          message: "2)Choose net",
          type: "list",
          choices: Object.values(ChoicesNet),
        },
        {
          name: "phrase",
          message: "3)Type phrases",
          type: "input",
        },
      ]
    )
    .then(({ blockchain, net, phrase }) => {
      switch (blockchain) {
        case ChoicesBlockchain.BTC:
          switch (net) {
            case ChoicesNet.MAIN:
              context.wallet = {
                blockchain: Blockchains.BTC,
                net: Net.MAIN,
                keys: new KeysBTC(phrase, Net.MAIN),
              };
              break;
            case ChoicesNet.TEST:
              context.wallet = {
                blockchain: Blockchains.BTC,
                net: Net.TEST,
                keys: new KeysBTC(phrase, Net.TEST),
              };
              break;
          }
          break;
      }
      promptWalletMenu(context);
    });
};
