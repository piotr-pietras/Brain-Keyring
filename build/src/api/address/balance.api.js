import https from "https";
import { HOST, NET, TOKEN } from "../index.js";
export const addressBalanceReq = (address) => {
    const options = Object.assign(Object.assign({}, HOST), { path: `/v1/btc/${NET}/addrs/${address}/balance?token=${TOKEN}`, method: "GET" });
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
