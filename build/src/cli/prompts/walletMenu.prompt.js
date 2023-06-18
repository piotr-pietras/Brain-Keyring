import inq from "inquirer";
import { promptMainMenu } from "./mainMenu.prompt.js";
import { printKeys, printWelcome } from "../printable.js";
import { createTransaction } from "./createTransaction.prompt.js";
var Choices;
(function (Choices) {
    Choices["TRANSACTION"] = "Make transaction";
    Choices["KEYS"] = "Show your keys (unsafe)";
    Choices["LOGOUT"] = "Logout";
})(Choices || (Choices = {}));
export const promptWalletMenu = (context, before) => {
    console.clear();
    printWelcome();
    before && before();
    const { blockchain, net, keys } = context.wallet;
    inq
        .prompt([
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
                printKeys(keys);
                promptWalletMenu(context, () => printKeys(keys));
                break;
            case Choices.LOGOUT:
                promptMainMenu(context);
                break;
        }
    });
};
