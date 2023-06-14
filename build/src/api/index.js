import { env } from "../env.js";
export const HOST = { host: "api.blockcypher.com", port: 443 };
export const NET = env.net === "MAIN_NET" ? "main" : "test3";
export const TOKEN = env.apiToken;
