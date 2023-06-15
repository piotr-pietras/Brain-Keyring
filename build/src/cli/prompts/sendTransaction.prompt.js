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
import { printWelcome } from "../welcoming.js";
import { promptWalletMenu } from "./walletMenu.prompt.js";
export const promptSendTransaction = (context) => {
    console.clear();
    printWelcome();
    //TX skeleton needs to be validated to avoid any malicious responses
    const { txSekeleton } = context.wallet.transaction;
    const { keys } = context.wallet;
    console.log("Your TX object was created successfully!");
    console.log("Check address, value and fees TWICE!");
    console.log("-------------------------------------------");
    console.log(`| Output address: HERE IS ADDRESS`);
    console.log(`| Value: HERE IS MONAY YOU SPEND`);
    console.log(`| Fees: ${txSekeleton.tx.fees}`);
    console.log("-------------------------------------------");
    inq
        .prompt([
        {
            name: "confirm",
            message: "Are you sure to sign this transaction?",
            type: "confirm",
        },
    ])
        .then(({ confirm }) => __awaiter(void 0, void 0, void 0, function* () {
        if (confirm) {
            try {
                context.wallet.transaction.sign(keys);
                yield context.wallet.transaction.send();
            }
            catch (err) {
                console.log(err);
            }
            console.log("Smoooth. Transaction signed! Check block explorer.");
            promptWalletMenu(context, true);
        }
        else {
            console.log("Transaction canceled");
        }
    }));
};
