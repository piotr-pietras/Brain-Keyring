import https from "https";
import { HOST, TOKEN } from "../index.js";

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
    path: `/v1/${params[0]}/${params[1]}/addrs/${address}/balance?token=${TOKEN}`,
    method: "GET",
  };

  return new Promise((resolver, reject) => {
    const req = https.request(options, (res) => {
      let data = Buffer.from([]);
      res.on("data", (chunk) => (data = Buffer.concat([data, chunk])));
      res.on("end", () => resolver(JSON.parse(data.toString())));
    });

    req.on("error", (err) => reject(`Request error: \n${err}`));
    req.end();
  });
};
