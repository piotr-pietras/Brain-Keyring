import inq from "inquirer";
import { Context } from "../context.js";
import { printBalance, printWelcome } from "../printable.js";
import { promptWalletMenu } from "./walletMenu.prompt.js";

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
        message: `${erc20.contract.name} => ERC20 token `,
        type: "list",
        choices: Object.values(Choices),
      },
    ])
    .then(async ({ wallet }) => {
      switch (wallet) {
        case Choices.BALANCE:
          try {
            const balance = await erc20.balance();
            promptTokenMenu(context, () =>
              printBalance(balance, 1, erc20.contract.name)
            );
          } catch (err) {
            // promptTokenMenu(context, () => boxedLog(err));
          }
          break;
        case Choices.BACK:
          promptWalletMenu(context);
          break;
      }
    });
};
