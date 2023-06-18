import inq from "inquirer";
import { Blockchains, Net } from "../../common/blockchain.types.js";
import { Keys } from "../../utils/Keys.js";
import { promptWalletMenu } from "./walletMenu.prompt.js";
import { printWelcome } from "../welcoming.js";
var ChoicesBlockchain;
(function (ChoicesBlockchain) {
    ChoicesBlockchain["BTC"] = "btc";
})(ChoicesBlockchain || (ChoicesBlockchain = {}));
var ChoicesNet;
(function (ChoicesNet) {
    ChoicesNet["MAIN"] = "main";
    ChoicesNet["TEST3"] = "test3";
})(ChoicesNet || (ChoicesNet = {}));
export const promptLoginToWallet = (context) => {
    console.clear();
    printWelcome();
    inq
        .prompt([
        {
            name: "blockchain",
            message: "Login to a wallet: \n1)Choose blockchain wallet",
            type: "list",
            choices: Object.values(ChoicesBlockchain),
        },
        {
            name: "net",
            message: "2)Choose net",
            type: "list",
            choices: Object.values(ChoicesNet),
        },
        {
            name: "phrase",
            message: "3)Type phrases",
            type: "input",
        },
    ])
        .then(({ blockchain, net, phrase }) => {
        switch (blockchain) {
            case ChoicesBlockchain.BTC:
                switch (net) {
                    case ChoicesNet.MAIN:
                        context.wallet = {
                            blockchain: Blockchains.BTC,
                            net: Net.MAIN,
                            keys: new Keys(phrase, Net.MAIN),
                        };
                        break;
                    case ChoicesNet.TEST3:
                        context.wallet = {
                            blockchain: Blockchains.BTC,
                            net: Net.TEST3,
                            keys: new Keys(phrase, Net.TEST3),
                        };
                        break;
                }
                break;
        }
        promptWalletMenu(context);
    });
};
