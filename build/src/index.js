import { getInitContext } from "./cli/context.js";
import { promptMainMenu } from "./cli/prompts/mainMenu.prompt.js";
console.clear();
promptMainMenu(getInitContext());
