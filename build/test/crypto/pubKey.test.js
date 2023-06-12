import assert from "assert";
import { hexToBytes as toBytes, bytesToHex as toHex, } from "@noble/hashes/utils";
import { toPubKey } from "../../src/crypto/pubKey.js";
const PRIV_KEY = "e5e1cb0a5287693924ef3b3d0d27b476299486356964a7f31cd835759d9bea5f";
const PUB_KEY = "040bf654bd2cfc5c16af3c1904572b749c1db27e31318ffd232b8f7c0320a1a1505926d668fc6bf3b9d782d4e01b75e8f50670d864a46b167d4add9cceef291b32";
const PUB_KEY_COMPRESSED = "020bf654bd2cfc5c16af3c1904572b749c1db27e31318ffd232b8f7c0320a1a150";
describe("Public key from private key", function () {
    it("should return valid non-compressed public key ", function () {
        const pubKey = toPubKey(toBytes(PRIV_KEY), false);
        assert.equal(toHex(pubKey), PUB_KEY);
    });
    it("should return valid compressed public key ", function () {
        const pubKey = toPubKey(toBytes(PRIV_KEY), true);
        assert.equal(toHex(pubKey), PUB_KEY_COMPRESSED);
    });
});
