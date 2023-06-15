import inq from "inquirer";
import { promptMainMenu } from "./mainMenu.prompt.js";
var Choices;
(function (Choices) {
    Choices["BTC_MAIN"] = "btc-main";
    Choices["BTC_TEST"] = "btc-test";
    Choices["CANCEL"] = "cancel";
})(Choices || (Choices = {}));
export const promptChooseBlockchain = (context) => {
    inq
        .prompt([
        { name: "ChooseBlockchain", type: "list", choices: Object.keys(Choices) },
    ])
        .then((a) => {
        switch (a.ChooseBlockchain) {
            case Choices.BTC_MAIN:
                break;
            case Choices.BTC_TEST:
                break;
            case Choices.CANCEL:
                promptMainMenu(context);
                break;
        }
    });
};
