import { Net } from "../common/blockchain.types.js";
import { KeysBTC } from "../utils/KeysBTC.js";
import { Transaction } from "../utils/Transaction.js";

// console.clear();
// promptMainMenu(getInitContext());

const test = async () => {
  console.log("start");
  const keys = new KeysBTC("test", Net.TEST);
  //2N3oefVeg6stiTb5Kh3ozCSkaqmx91FDbsm
  //1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX
  const transaction = new Transaction(
    {
      destination: "2N3oefVeg6stiTb5Kh3ozCSkaqmx91FDbsm",
      amount: 10000,
    },
    keys
  );

  const a = await transaction.build();
  console.log(a);
};

test();
