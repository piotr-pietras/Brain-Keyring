import { sha256 } from "@noble/hashes/sha256";
import { secp256k1 } from "@noble/curves/secp256k1";
import bs58 from "bs58";
import ripemd160 from "ripemd160";

const ADR_MAIN_NET_PREFIX = "00";
const ADR_TEST_NET_PREFIX = "6F";
// const WIF_MAIN_NET_PREFIX = "80";
// const WIF_TEST_NET_PREFIX = "EF";

export class Keys {
  isTestnet = true;
  phrase: string;
  privKey: Uint8Array;
  pubKey: Uint8Array;
  address: string;

  constructor(phrase: string) {
    this.phrase = phrase;
    this.privKey = this.phraseToPrivKey(this.phrase);
    this.pubKey = this.privKeyToPubKey(this.privKey);
    this.address = this.pubKeyToAddress(this.pubKey);
  }

  private phraseToPrivKey(phrase: string) {
    return sha256(phrase);
  }

  private privKeyToPubKey(privKey: Uint8Array) {
    return secp256k1.getPublicKey(privKey, false);
  }

  private pubKeyToAddress = (pubKey: Uint8Array) => {
    const prefix = this.isTestnet ? ADR_TEST_NET_PREFIX : ADR_MAIN_NET_PREFIX;
    const base = sha256(Buffer.from(pubKey));

    const ripemd = new ripemd160().update(Buffer.from(base)).digest();
    const ripemdPrefixed = Buffer.concat([Buffer.from(prefix, "hex"), ripemd]);
    const checksum = Buffer.from(sha256(sha256(ripemdPrefixed)).slice(0, 4));
    const ripemdChecksum = Buffer.concat([ripemdPrefixed, checksum]);

    return bs58.encode(ripemdChecksum);
  };

  //   private privKeyToWif(privKey: Uint8Array) {
  //     const prefix = this.isTestnet ? WIF_TEST_NET_PREFIX : WIF_MAIN_NET_PREFIX;
  //     const privKeyPrefixed = Buffer.concat([
  //       Buffer.from(prefix, "hex"),
  //       privKey,
  //     ]);

  //     const checksum = Buffer.from(sha256(sha256(privKeyPrefixed)).slice(0, 4));
  //     const privateKeyChecksum = Buffer.concat([privKeyPrefixed, checksum]);

  //     const wif = bs58.encode(privateKeyChecksum);
  //     return new Uint8Array(Buffer.from(wif, "hex"));
  //   }

  sign(msg: string, privKey: Uint8Array) {
    return secp256k1.sign(msg, Buffer.from(privKey).toString("hex"));
  }

  logInfo() {
    process.stdout.write("Private Key: ");
    process.stdout.write(Buffer.from(this.privKey).toString("hex") + "\n");
    process.stdout.write("Public Key (uncompressed): ");
    process.stdout.write(Buffer.from(this.pubKey).toString("hex") + "\n");
    process.stdout.write("Address: ");
    process.stdout.write(this.address + "\n");
  }
}
