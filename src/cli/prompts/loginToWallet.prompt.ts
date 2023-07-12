import inq from "inquirer";
import { Context } from "../context.js";
import { Blockchains, Net } from "../../common/blockchain.types.js";
import { KeysBTC } from "../../utils/KeysBTC.js";
import { promptWalletMenu } from "./walletMenu.prompt.js";
import { printWelcome } from "../printable.js";
import { KeysETH } from "../../utils/KeysETH.js";

export const promptLoginToWallet = (context: Context) => {
  console.clear();
  printWelcome();

  inq
    .prompt<{ blockchain: Blockchains; net: Net; phrase: string }>([
      {
        name: "blockchain",
        message: "Login to a wallet: \n1)Choose blockchain wallet",
        type: "list",
        choices: Object.values(Blockchains),
      },
      {
        name: "net",
        message: "2)Choose net",
        type: "list",
        choices: Object.values(Net),
      },
      {
        name: "phrase",
        message: "3)Type phrases",
        type: "input",
      },
    ])
    .then(({ blockchain, net, phrase }) => {
      switch (blockchain) {
        case Blockchains.BTC:
          context.wallet = {
            keys: new KeysBTC(phrase, net),
          };
          break;
        case Blockchains.ETH:
          context.wallet = {
            keys: new KeysETH(phrase, net),
          };
          break;
      }
      promptWalletMenu(context);
    });
};
