import https from "https";
import { HOST, BLOCK_CYPHER_TOKEN } from "../index.js";
import { ContractReq } from "../../utils/ERC20.types.js";

interface TokenBalanceRes {
  results: [[number]];
  error?: string;
}

export const checkTokenBalance = (
  contract: ContractReq,
  params: [string, string]
): Promise<TokenBalanceRes> => {
  const toSend = JSON.stringify(contract);
  const options: https.RequestOptions = {
    ...HOST,
    path: `/v1/${params[0]}/${params[1]}/contracts/${contract.address}/balanceOf?token=${BLOCK_CYPHER_TOKEN}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": toSend.length,
    },
  };
  return new Promise((resolver, reject) => {
    const req = https.request(options, (res) => {
      let data = Buffer.from([]);
      res.on("data", (chunk) => (data = Buffer.concat([data, chunk])));
      res.on("end", () => resolver(JSON.parse(data.toString())));
    });

    req.on("error", (err) => reject(`Request error: \n${err}`));
    req.write(toSend);
    req.end();
  });
};
