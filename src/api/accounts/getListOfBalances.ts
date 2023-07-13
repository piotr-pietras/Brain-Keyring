import https from "https";
import { HOST, BLOCK_DEAMON_TOKEN } from "../index.js";

interface Response {
  confirmed_balance: number;
}

export const getListOfBalances = (
  address: string,
  params: [string, string]
): Promise<Response[]> => {
  const options: https.RequestOptions = {
    ...HOST,
    path: `/universal/v1/${params[0]}/${params[1]}/account/${address}`,
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-Key": BLOCK_DEAMON_TOKEN,
    },
  };

  return new Promise((resolver, reject) => {
    const req = https.request(options, (res) => {
      let data = Buffer.from([]);
      res.on("data", (chunk) => (data = Buffer.concat([data, chunk])));
      res.on("end", () => {
        const json = JSON.parse(data.toString());
        if (json?.status) reject(json);
        resolver(json);
      });
    });

    req.on("error", (err) => reject(err));
    req.end();
  });
};
