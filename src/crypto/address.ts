import { sha256 } from "@noble/hashes/sha256";
import bs58 from "bs58";
import ripemd160 from "ripemd160";

const MAIN_NET_PREFIX = "00";
const TEST_NET_PREFIX = "6F";

export const toAddress = (pubKey: Uint8Array, isTestnet?: boolean) => {
  const prefix = isTestnet ? TEST_NET_PREFIX : MAIN_NET_PREFIX;
  const base = sha256(Buffer.from(pubKey));

  const ripemd = new ripemd160().update(Buffer.from(base)).digest();
  const ripemdPrefixed = Buffer.concat([Buffer.from(prefix, "hex"), ripemd]);

  const checksum = Buffer.from(sha256(sha256(ripemdPrefixed)).slice(0, 4));
  const ripemdChecksum = Buffer.concat([ripemdPrefixed, checksum]);

  const address = bs58.encode(ripemdChecksum);
  return address;
};
