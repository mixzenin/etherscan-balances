const request = require("request");
const ETHERSCAN_URL_API = require("./config").ETHERSCAN_URL_API;


/** 
 * @description Get last block of Ethereum blockchain
 * @return {number} Number of last block
 */ 
let getLastBlockNumber = async () => {
  const qs = {
    module: "proxy",
    action: "eth_blockNumber"
  };
  const response = await callEtherscanApi(qs);
  return parseInt(response.result, 16);
};

/** 
 * @description Get all transactions in block
 * @param {number} blockNumber Number of block for get transactions
 * @return {Object[]} Transactions in block
 */ 
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

/** 
 * @description Call Etherscan API
 * @param {number} qs Params of API method
 * @return {Object} Response of API
 */ 
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
