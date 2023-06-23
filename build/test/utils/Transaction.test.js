var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import nock from "nock";
import { KeysBTC } from "../../src/utils/KeysBTC.js";
import { Net } from "../../src/common/blockchain.types.js";
import { HOST, TOKEN } from "../../src/api/index.js";
import { Transaction } from "../../src/utils/Transaction.js";
import { getParams } from "../../src/api/params.js";
import assert from "assert";
const TX_SEED = {
    inputAddress: "1HKqKTMpBTZZ8H5zcqYEWYBaaWELrDEXeE",
    outputAddress: "1ATYsTBaRVYMkKqW66hr4L2UgR9oXN5hRg",
    value: 10000,
};
const performAction = (t, action) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        action === "create" && (yield t.create());
        action === "send" && (yield t.send());
        action === "validate" && (yield t.validateSkeleton());
    }
    catch (err) {
        return err.toString();
    }
});
describe("Transaction class", function () {
    const keys = new KeysBTC("test", Net.MAIN);
    const params = getParams(keys);
    const mocked = nock(`https://${HOST.host}`);
    describe("Create TX", function () {
        const createUrl = `/v1/${params[0]}/${params[1]}/txs/new?token=${TOKEN}`;
        const transaction = new Transaction(TX_SEED, keys);
        mocked.post(createUrl).reply(200, { tx: {} });
        it("should return skeleton without errors", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const error = yield performAction(transaction, "create");
                assert.deepEqual(transaction.txSekeleton, { tx: {} });
                assert.equal(error, undefined);
            });
        });
        mocked.post(createUrl).replyWithError("");
        it("should throw request error", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const error = yield performAction(transaction, "create");
                assert.ok(error.includes("Request error:"));
            });
        });
        mocked.post(createUrl).reply(200, { tx: {}, errors: {} });
        it("should throw response errors", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const error = yield performAction(transaction, "create");
                assert.ok(error.includes("Response error:"));
            });
        });
        mocked.post(createUrl).reply(200, { tx: {}, error: {} });
        it("should throw response error", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const error = yield performAction(transaction, "create");
                assert.ok(error.includes("Response error:"));
            });
        });
    });
    describe("Sign TX", function () {
        const transaction = new Transaction(TX_SEED, keys);
        transaction.txSekeleton = { tx: {}, tosign: ["a1"] };
        it("it should return correctly signed TX", function () {
            transaction.sign();
            assert.deepEqual(transaction.txSigned, {
                tx: {},
                tosign: ["a1"],
                pubkeys: [keys.keysHex.pubKey],
                signatures: [
                    "3045022100eaf9ff37048ec39b417f3198bcfa0ef15b27dc4dd16122039a0ae49f4ca8422f022058238577278eb7c01901a896a5b0e71b33f6bd187d3089fb274d8538bb5ae30d",
                ],
            });
        });
    });
    describe("Send TX", function () {
        const sendUrl = `/v1/${params[0]}/${params[1]}/txs/send?token=${TOKEN}`;
        const transaction = new Transaction(TX_SEED, keys);
        transaction.txSigned = {};
        mocked.post(sendUrl).reply(200, { tx: {} });
        it("should return completed TX without errors", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const error = yield performAction(transaction, "send");
                assert.deepEqual(transaction.txCompleted, { tx: {} });
                assert.equal(error, undefined);
            });
        });
        mocked.post(sendUrl).replyWithError("");
        it("should throw request error", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const error = yield performAction(transaction, "send");
                assert.ok(error.includes("Request error:"));
            });
        });
        mocked.post(sendUrl).reply(200, { tx: {}, errors: {} });
        it("should throw response errors", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const error = yield performAction(transaction, "send");
                assert.ok(error.includes("Response error:"));
            });
        });
        mocked.post(sendUrl).reply(200, { tx: {}, error: {} });
        it("should throw response error", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const error = yield performAction(transaction, "send");
                assert.ok(error.includes("Response error:"));
            });
        });
    });
    describe("Validate TX", function () {
        const address = TX_SEED.inputAddress;
        const balance = TX_SEED.value * 100;
        const fees = 1;
        const paybackValue = balance - TX_SEED.value - fees;
        const balanceUrl = `/v1/${params[0]}/${params[1]}/addrs/${address}/balance?token=${TOKEN}`;
        const transaction = new Transaction(TX_SEED, keys);
        mocked.get(balanceUrl).reply(200, { balance });
        it("should return error because of unknown address in output property", function () {
            return __awaiter(this, void 0, void 0, function* () {
                transaction.txSekeleton = {
                    tx: {
                        outputs: [
                            { addresses: [TX_SEED.inputAddress] },
                            { addresses: [TX_SEED.outputAddress] },
                            { addresses: ["a1"] },
                        ],
                    },
                };
                const error = yield performAction(transaction, "validate");
                assert.ok(error.includes("invalid"));
            });
        });
        mocked.get(balanceUrl).reply(200, { balance });
        it("should return error because of excessive number of addresses", function () {
            return __awaiter(this, void 0, void 0, function* () {
                transaction.txSekeleton = {
                    tx: {
                        outputs: [
                            { addresses: [TX_SEED.inputAddress, "a1"] },
                            { addresses: [TX_SEED.outputAddress] },
                        ],
                    },
                };
                const error = yield performAction(transaction, "validate");
                assert.ok(error.includes("invalid"));
            });
        });
        mocked.get(balanceUrl).reply(200, { balance });
        it("should return error when value to send is incorrect", function () {
            return __awaiter(this, void 0, void 0, function* () {
                transaction.txSekeleton = {
                    tx: {
                        outputs: [
                            { addresses: [TX_SEED.outputAddress], value: TX_SEED.value + 1 },
                        ],
                    },
                };
                const error = yield performAction(transaction, "validate");
                assert.ok(error.includes("invalid"));
            });
        });
        mocked.get(balanceUrl).reply(200, { balance });
        it("should return error when payback value is incorrect", function () {
            return __awaiter(this, void 0, void 0, function* () {
                transaction.txSekeleton = {
                    tx: {
                        fees,
                        outputs: [
                            {
                                addresses: [TX_SEED.inputAddress],
                                value: paybackValue - 1,
                            },
                            { addresses: [TX_SEED.outputAddress], value: TX_SEED.value },
                        ],
                    },
                };
                const error = yield performAction(transaction, "validate");
                assert.ok(!error);
            });
        });
        mocked.get(balanceUrl).reply(200, { balance });
        it("validates skeleton correctly", function () {
            return __awaiter(this, void 0, void 0, function* () {
                transaction.txSekeleton = {
                    tx: {
                        fees,
                        outputs: [
                            {
                                addresses: [TX_SEED.inputAddress],
                                value: paybackValue,
                            },
                            { addresses: [TX_SEED.outputAddress], value: TX_SEED.value },
                        ],
                    },
                };
                const error = yield performAction(transaction, "validate");
                assert.ok(!error);
            });
        });
    });
});
