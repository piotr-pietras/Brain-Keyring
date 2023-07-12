import https from "https";
import { HOST, BLOCK_CYPHER_TOKEN } from "../index.js";

interface BalanceRes {
  balance: number;
  total_received: number;
  total_sent: number;
}

export const checkBalance = (
  address: string,
  params: [string, string]
): Promise<BalanceRes> => {
  const options: https.RequestOptions = {
    ...HOST,
    path: `/v1/${params[0]}/${params[1]}/addrs/${address}/balance?token=${BLOCK_CYPHER_TOKEN}`,
    method: "GET",
  };

  return new Promise((resolver, reject) => {
    const req = https.request(options, (res) => {
      let data = Buffer.from([]);
      res.on("data", (chunk) => (data = Buffer.concat([data, chunk])));
      res.on("end", () => {
        const json = JSON.parse(data.toString())
        if(json?.error) reject(json.error)
        if(json?.errors) reject(json.errors)
        resolver(json);
      });
    });

    req.on("error", (err) => reject(`Request error: \n${err}`));
    req.end();
  });
};
