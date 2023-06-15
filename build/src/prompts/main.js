import inq from "inquirer";
// enum MainPromptChoices {
//     BTC_MAIN ="btc-main",
//     BTC_TEST = "btc-test"
// }
var MainPromptChoices;
(function (MainPromptChoices) {
    MainPromptChoices["login"] = "login";
    MainPromptChoices["exit"] = "exit";
})(MainPromptChoices || (MainPromptChoices = {}));
export const buildMainMenuPrompt = () => {
    const name = "mainMenu";
    return {
        name,
        call: inq
            .prompt([
            { name, type: "list", choices: ["btc-main", "btc-test"], },
        ])
            .then((answer) => {
            console.log(answer);
        }),
    };
};
