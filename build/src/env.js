var _a, _b;
import dotenv from "dotenv";
dotenv.config();
export const env = {
    apiToken: ((_a = process.env) === null || _a === void 0 ? void 0 : _a.BLOCK_API_TOKEN) || "",
    net: ((_b = process.env) === null || _b === void 0 ? void 0 : _b.NET) || "TEST_NET",
};
