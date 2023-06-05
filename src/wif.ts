import bs58 from "bs58";
import { sha256 } from "@noble/hashes/sha256";
import { Buffer } from "buffer";

const MAIN_NET_PREFIX = "80";
const TEST_NET_PREFIX = "EF";

export const toWif = (privKey, isTestnet) => {
  const prefix = isTestnet ? TEST_NET_PREFIX : MAIN_NET_PREFIX;
  const privKeyPrefixed = Buffer.concat([Buffer.from(prefix, "hex"), privKey]);

  const checksum = Buffer.from(sha256(sha256(privKeyPrefixed)).slice(0, 4));
  const privateKeyChecksum = Buffer.concat([privKeyPrefixed, checksum]);

  const wif = bs58.encode(privateKeyChecksum);
  return wif;
};
