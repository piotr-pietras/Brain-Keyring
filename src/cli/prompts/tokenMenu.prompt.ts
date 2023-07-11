import inq from "inquirer";
import { Context } from "../context.js";
import { promptMainMenu } from "./mainMenu.prompt.js";
import { printBalance, printWelcome } from "../printable.js";

enum Choices {
  BALANCE = "Check balance",
  BACK = "Back",
}

export const promptTokenMenu = (context: Context, before?: () => void) => {
  console.clear();
  printWelcome();
  before && before();

  const { erc20 } = context.wallet;

  inq
    .prompt<{ wallet: Choices }>([
      {
        name: "wallet",
        message: `${context.wallet.erc20Name} => ERC20 token `,
        type: "list",
        choices: Object.values(Choices),
      },
    ])
    .then(async ({ wallet }) => {
      switch (wallet) {
        case Choices.BALANCE:
          const balance = await erc20.balance();
          promptTokenMenu(context, () => printBalance(balance));
          break;
        case Choices.BACK:
          promptMainMenu(context);
          break;
      }
    });
};
