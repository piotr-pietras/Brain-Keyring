import assert from "assert";
import { hexToBytes as toBytes } from "@noble/hashes/utils";
import { toWif } from "../../src/crypto/wif.js";

const PRIV_KEY =
  "e5e1cb0a5287693924ef3b3d0d27b476299486356964a7f31cd835759d9bea5f";
const WIF_TEST = "93LABzzy2wu6TqLUKdFoP2XgBGPCyaZ6Xhtnvp8hErWdmdeKMRZ";
const WIF_MAIN = "5KZXcGBRSipxVmqBhHMtWRyiXc2VpR1uBm2qrBnBu7mazdtBvER";

describe("Wif key from public key", function () {
  it("should return valid wif for test net", function () {
    const wif = toWif(toBytes(PRIV_KEY), true);
    assert.equal(wif, WIF_TEST);
  });

  it("should return valid wif for main net ", function () {
    const wif = toWif(toBytes(PRIV_KEY), false);
    assert.equal(wif, WIF_MAIN);
  });
});
