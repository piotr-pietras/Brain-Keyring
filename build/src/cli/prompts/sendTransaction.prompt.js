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
import { printWelcome } from "../printable.js";
import { promptWalletMenu } from "./walletMenu.prompt.js";
import { log } from "../../common/log.js";
export const promptSendTransaction = (context) => __awaiter(void 0, void 0, void 0, function* () {
    console.clear();
    printWelcome();
    try {
        const { transaction } = context.wallet;
        const { balance, fees, value } = yield transaction.validateSkeleton();
        log("Your TX object was created successfully!");
        log("Check address, value and fees TWICE!");
        log("-------------------------------------------");
        log(`| Current balance: ${balance}`);
        log(`| Output: ${value}`);
        log(`| Fees: ${fees}`);
        log(`| Balance after transaction: ${balance - value - fees}`);
        log("-------------------------------------------");
    }
    catch (err) {
        log(err);
    }
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
                context.wallet.transaction.sign();
                yield context.wallet.transaction.send();
            }
            catch (err) {
                promptWalletMenu(context, () => log(err));
            }
            promptWalletMenu(context, () => log("Transaction signed!"));
        }
        else {
            promptWalletMenu(context, () => log("Transaction canceled"));
        }
    }));
});
