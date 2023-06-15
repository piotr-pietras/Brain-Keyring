import https from "https";
import { HOST, TOKEN } from "../index.js";
import { Net } from "../../common/blockchain.types.js";

interface BalanceRes {
  balance: number;
  total_received: number;
  total_sent: number;
}

export const addressBalanceReq = (
  address: string,
  net: Net
): Promise<BalanceRes> => {
  const options: https.RequestOptions = {
    ...HOST,
    path: `/v1/btc/${net}/addrs/${address}/balance?token=${TOKEN}`,
    method: "GET",
  };

  return new Promise((resolver, reject) => {
    const req = https.request(options, (res) => {
      let data = Buffer.from([]);
      res.on("data", (chunk) => (data = Buffer.concat([data, chunk])));
      res.on("end", () => resolver(JSON.parse(data.toString())));
    });

    req.on("error", (err) => {
      console.log(err);
      reject("Error...");
    });
    req.end();
  });
};
