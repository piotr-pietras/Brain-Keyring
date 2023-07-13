import https from "https";
import { HOST, BLOCK_DEAMON_TOKEN } from "../index.js";

type EventType = "fee" | "utxo_input" | "utxo_output";
type ScriptType =
  | "witness_v0_keyhash"
  | "witness_v1_taproot"
  | "scripthash"
  | "pubkeyhash";
interface Response {
  data: {
    id: string;
    block_number: number;
    events: {
      transaction_id: string;
      type: EventType;
      amount: number;
      decimals: number;
      meta: {
        index: number;
        script_type: ScriptType;
      };
    }[];
  }[];
  meta: {
    paging: {
      next_page_token: string;
    };
  };
}

export const getListOfTransactions = (
  params: [string, string],
  pageToken?: string
): Promise<Response> => {
  const query = pageToken ? `&page_token=${pageToken}` : "";
  const options: https.RequestOptions = {
    ...HOST,
    path: `/universal/v1/${params[0]}/${params[1]}/txs?order=desc&page_size=100${query}`,
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
