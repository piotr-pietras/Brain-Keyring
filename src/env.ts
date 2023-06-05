import dotenv from "dotenv";

dotenv.config();

type NET = "MAIN_NET" | "TEST_NET";
interface ENV {
  apiToken: string;
  net: NET;
}

export const env: ENV = {
  apiToken: process.env?.BLOCK_API_TOKEN || "",
  net: (process.env?.NET as NET) || "TEST_NET",
};
