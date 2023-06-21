var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import inq from "inquirer";
import { promptMainMenu } from "./mainMenu.prompt.js";
import { printBalance, printKeys, printWelcome } from "../printable.js";
import { createTransaction } from "./createTransaction.prompt.js";
var Choices;
(function (Choices) {
    Choices["TRANSACTION"] = "Make transaction";
    Choices["BALANCE"] = "Check balance";
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
        .then(({ wallet }) => __awaiter(void 0, void 0, void 0, function* () {
        const { keys } = context.wallet;
        switch (wallet) {
            case Choices.TRANSACTION:
                createTransaction(context);
                break;
            case Choices.BALANCE:
                const balance = yield keys.balance();
                promptWalletMenu(context, () => printBalance(balance));
                break;
            case Choices.KEYS:
                promptWalletMenu(context, () => printKeys(keys));
                break;
            case Choices.LOGOUT:
                promptMainMenu(context);
                break;
        }
    }));
};
