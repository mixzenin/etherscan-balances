const request = require("request");
const ETHERSCAN_URL_API = require("./config").ETHERSCAN_URL_API;

let getLastBlockNumber = async () => {
  const qs = {
    module: "proxy",
    action: "eth_blockNumber"
  };
  const response = await callEtherscanApi(qs);
  return response.result;
};

let getTransactionsInBlock = async blockNumber => {
  const qs = {
    module: "proxy",
    action: "eth_getBlockByNumber",
    tag: blockNumber,
    boolean: true
  };
  const response = await callEtherscanApi(qs)
  return response.result.transactions
};

let callEtherscanApi = qs => {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: ETHERSCAN_URL_API,
        qs,
        json: true
      },
      (error, response, body) => {
        error ? reject(error) : resolve(body);
      }
    );
  });
};

module.exports = {
  getLastBlockNumber,
  getTransactionsInBlock
};
