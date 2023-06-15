import inq from "inquirer";
import { Context } from "../context.js";
import { Blockchains } from "../../common/blockchain.types.js";
import { promptMainMenu } from "./mainMenu.prompt.js";

enum Choices {
  BTC_MAIN = Blockchains.BTC_MAIN,
  BTC_TEST = Blockchains.BTC_TEST,
  CANCEL = "cancel",
}

export const promptChooseBlockchain = (context: Context) => {
  inq
    .prompt<{ ChooseBlockchain: Choices }>([
      { name: "ChooseBlockchain", type: "list", choices: Object.values(Choices) },
    ])
    .then((a) => {
      switch (a.ChooseBlockchain) {
        case Choices.BTC_MAIN:
          break;
        case Choices.BTC_TEST:
          break;
        case Choices.CANCEL:
          promptMainMenu(context);
          break;
      }
    });
};
