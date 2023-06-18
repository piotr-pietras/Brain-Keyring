import inq from "inquirer";
import { promptMainMenu } from "./mainMenu.prompt.js";
import { printWelcome } from "../welcoming.js";
import { createTransaction } from "./createTransaction.prompt.js";
import { log } from "../../common/log.js";
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
