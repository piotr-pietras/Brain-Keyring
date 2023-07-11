import inq from "inquirer";
import { Context } from "../context.js";
import { printWelcome } from "../printable.js";
import { Net } from "../../common/blockchain.types.js";
import { promptTokenMenu } from "./tokenMenu.prompt.js";
import { ERC20 } from "../../utils/ERC20.js";
import { KeysETH } from "../../utils/KeysETH.js";

const ERC20List = [
  { token: "USDC", contractAdress: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" },
];
const ERC20TestList = [
  {
    token: "USDtest",
    contractAdress: "c557fad66323d87d981595c9e30155f959bd54a2",
  },
];

export const promptChooseToken = (context: Context) => {
  console.clear();
  printWelcome();

  const { keys } = context.wallet;
  const list = keys.net === Net.MAIN ? ERC20List : ERC20TestList;
  const choices = list.map(({ token }) => token);

  inq
    .prompt<{ token: string }>([
      {
        name: "token",
        message: `Choose token from the list`,
        type: "list",
        choices,
      },
    ])
    .then(async ({ token }) => {
      const contract = list.find(({ token: t }) => t === token);
      context.wallet.erc20 = new ERC20(
        contract.contractAdress,
        context.wallet.keys as KeysETH
      );
      context.wallet.erc20Name = contract.token;
      promptTokenMenu(context);
    });
};
