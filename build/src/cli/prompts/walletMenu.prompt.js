import inq from "inquirer";
import { promptMainMenu } from "./mainMenu.prompt.js";
import { printWelcome } from "../welcoming.js";
import { createTransaction } from "./createTransaction.prompt.js";
var Choices;
(function (Choices) {
    Choices["TRANSACTION"] = "Make transaction";
    Choices["KEYS"] = "Show your keys (unsafe)";
    Choices["LOGOUT"] = "Logout";
})(Choices || (Choices = {}));
export const promptWalletMenu = (context, skipWelcome) => {
    if (!skipWelcome) {
        console.clear();
        printWelcome();
    }
    if (!context.wallet)
        throw "Wallet is not initialized";
    const { blockchain, net, keys } = context.wallet;
    inq
        .prompt([
        {
            name: "wallet",
            message: `${blockchain}-${net} => address: ${keys.address}`,
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
                keys.logKeys();
                promptWalletMenu(context, true);
                break;
            case Choices.LOGOUT:
                promptMainMenu(context);
                break;
        }
    });
};
