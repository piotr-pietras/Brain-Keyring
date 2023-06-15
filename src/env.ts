import dotenv from "dotenv";

dotenv.config();
interface ENV {
  apiToken: string;
}

export const env: ENV = {
  apiToken: process.env?.BLOCK_API_TOKEN || "",
};
