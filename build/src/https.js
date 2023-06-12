import https from "https";
import { env } from "./env.js";
const net = env.net === "MAIN_NET" ? "main" : "test3";
export const addressBalanceReq = (address) => new Promise((resolver, reject) => {
    const req = https.request({
        host: "api.blockcypher.com",
        port: 443,
        path: `/v1/btc/${net}/addrs/${address}/balance?token=${env.apiToken}`,
        method: "GET",
    }, (res) => {
        res.on("data", (chunk) => {
            const obj = JSON.parse(chunk.toString());
            resolver({
                balance: obj.balance,
                totalReceived: obj.total_received,
                totalSent: obj.total_sent,
            });
        });
    });
    req.on("error", (err) => reject("Error..."));
    req.end();
});
