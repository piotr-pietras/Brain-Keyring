import inq from "inquirer";
import { promptChooseBlockchain } from "./chooseBlockchain.prompt.js";
var Choices;
(function (Choices) {
    Choices["LOGIN"] = "login";
    Choices["EXIT"] = "exit";
})(Choices || (Choices = {}));
export const promptMainMenu = (context) => {
    inq
        .prompt([
        { name: "MainMenu", type: "list", choices: Object.values(Choices) },
    ])
        .then((a) => {
        switch (a.MainMenu) {
            case Choices.EXIT:
                break;
            case Choices.LOGIN:
                console.log('login');
                promptChooseBlockchain(context);
                break;
        }
    });
};
