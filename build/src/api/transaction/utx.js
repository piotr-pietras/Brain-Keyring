import https from "https";
import { HOST, NET, TOKEN } from "../index.js";
export const utxReq = () => new Promise((resolver, reject) => {
    const req = https.request(Object.assign(Object.assign({}, HOST), { path: `/v1/btc/${NET}/txs?token=${TOKEN}`, method: "GET" }), (res) => {
        res.on("data", (chunk) => {
            //PARSE STRING ERROR
            // const obj = JSON.parse(chunk.toString());
            resolver({});
        });
    });
    req.on("error", (err) => {
        console.log(err);
        reject("Error...");
    });
    req.end();
});
