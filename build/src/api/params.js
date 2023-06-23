const params = {
    btc: {
        main: ["btc", "main"],
        test: ["btc", "test3"],
    },
    eth: {
        main: ["eth", "main"],
        test: ["beth", "test"],
    },
};
export const getParams = (keys) => {
    return params[keys.blockchain][keys.net];
};
