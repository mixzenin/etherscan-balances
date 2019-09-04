const request = require("request");
const addresses = new Map();
const ETHERSCAN_URL_API = "https://api.etherscan.io/api";

let getLastBlockNumber = () => {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: ETHERSCAN_URL_API,
        qs: {
          module: "proxy",
          action: "eth_blockNumber"
        },
        json: true
      },
      (error, response, body) => {
        error ? reject(error) : resolve(body.result); // поле result содержит номер блока в 16ричной СС
      }
    );
  });
};

let getTransactionsInBlock = blockNumber => {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: ETHERSCAN_URL_API,
        qs: {
          module: "proxy",
          action: "eth_getBlockByNumber",
          tag: blockNumber,
          boolean: true
        },
        json: true
      },
      (error, response, body) => {
        error ? reject(error) : resolve(body.result.transactions);
      }
    );
  });
};

module.exports = {
  getLastBlockNumber,
  getTransactionsInBlock
};
