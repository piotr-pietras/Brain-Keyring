import { checkTokenBalance } from "../api/contract/checkTokenBalance.api.js";
import { getParams } from "../api/params.js";
import { Contract } from "./ERC20.types.js";
import { KeysETH } from "./KeysETH.js";

export class ERC20 {
  error: string = "";
  contract: Contract;
  keys: KeysETH;

  constructor(contract: Contract, keys: KeysETH) {
    this.contract = contract;
    this.keys = keys;
  }

  async balance() {
    console.log(this.contract);
    const res = await checkTokenBalance(
      {
        ...this.contract,
        gas_limit: 1,
        params: [this.keys.addressHex],
        private:
          "1111111111111111111111111111111111111111111111111111111111111111", //dummy priv key
      },
      getParams(this.keys)
    );
    console.log(res);
    if (res.error) throw `Response error:\n ${res.error}`;
    return res.results[0][0];
  }
}
