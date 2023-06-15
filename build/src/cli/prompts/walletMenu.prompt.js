import inq from "inquirer";
import { promptMainMenu } from "./mainMenu.prompt.js";
import { printWelcome } from "../welcoming.js";
import { Net } from "../../common/blockchain.types.js";
var Choices;
(function (Choices) {
    Choices["KEYS"] = "Show your keys (unsafe)";
    Choices["LOGOUT"] = "Logout";
})(Choices || (Choices = {}));
export const promptWalletMenu = (context) => {
    console.clear();
    printWelcome();
    if (!context.wallet)
        throw "Wallet is not initialized";
    const { blockchain, net, keys } = context.wallet;
    const netParam = net === Net.MAIN ? "mainnet" : "testnet";
    const explorer = `https://live.blockcypher.com/${blockchain}-${netParam}/address/${keys.address}/`;
    inq
        .prompt([
        {
            name: "wallet",
            message: `${blockchain}-${net} => address: ${keys.address}\n${explorer}`,
            type: "list",
            choices: Object.values(Choices),
        },
    ])
        .then(({ wallet }) => {
        switch (wallet) {
            case Choices.KEYS:
                keys.logKeys();
                promptWalletMenu(context);
                break;
            case Choices.LOGOUT:
                promptMainMenu(context);
                break;
        }
    });
};
