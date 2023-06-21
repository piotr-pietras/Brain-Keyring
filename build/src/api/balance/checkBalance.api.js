import https from "https";
import { HOST, TOKEN } from "../index.js";
import { Net } from "../../common/blockchain.types.js";
export const checkBalance = (address, net) => {
    const netParam = net === Net.TEST ? "test3" : "main";
    const options = Object.assign(Object.assign({}, HOST), { path: `/v1/btc/${netParam}/addrs/${address}/balance?token=${TOKEN}`, method: "GET" });
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
