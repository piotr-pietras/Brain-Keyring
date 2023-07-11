import inq from "inquirer";
import { Context } from "../context.js";
import { printWelcome } from "../printable.js";
import { Net } from "../../common/blockchain.types.js";
import { promptTokenMenu } from "./tokenMenu.prompt.js";
import { ERC20 } from "../../utils/ERC20.js";
import { KeysETH } from "../../utils/KeysETH.js";
import { Contract } from "../../utils/ERC20.types.js";

const ERC20List: Contract[] = [
  {
    name: "USDT",
    address: "dac17f958d2ee523a2206206994597c13d831ec7",
  },
  {
    name: "USDC",
    address: "a2327a938febf5fec13bacfb16ae10ecbc4cbdcf",
  },
];

//Wallet built upon 'test1' phrase has the balance
const ERC20TestList: Contract[] = [
  {
    name: "ERC20Basic",
    address: "31f75c38ce20ad15b26163e9e8fb521008df0f5a",
  },
];

export const promptChooseToken = (context: Context) => {
  console.clear();
  printWelcome();

  const { keys } = context.wallet;
  const list = keys.net === Net.MAIN ? ERC20List : ERC20TestList;
  const choices = list.map(({ name }) => name);

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
      const contract = list.find(({ name }) => name === token);
      context.wallet.erc20 = new ERC20(
        contract,
        context.wallet.keys as KeysETH
      );
      promptTokenMenu(context);
    });
};
