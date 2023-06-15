var _a;
import dotenv from "dotenv";
dotenv.config();
export const env = {
    apiToken: ((_a = process.env) === null || _a === void 0 ? void 0 : _a.BLOCK_API_TOKEN) || "",
};
