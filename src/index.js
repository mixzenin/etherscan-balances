const etherscan = require("./etherscan");

/** 
 * @description Calculate balance changes for each address
 * @param {number} blockNumber Number of block for get transactions
 * @param {Object} balanceChanges Array of balance changes
 * @return {Object} Modified array of balance changes
 */ 
let calculateBalanceChanges = async (blockNumber, balanceChanges) => {
  let transactionsInBlock = [];
  try {
    transactionsInBlock = await etherscan.getTransactionsInBlock(
      blockNumber.toString(16)
    );
    console.log(`Transactions in block ${blockNumber} received`);
  } catch (err) {
    throw new Error(err);
  }
  transactionsInBlock.forEach(transaction => {
    if (balanceChanges[transaction.from] === undefined)
      balanceChanges[transaction.from] = 0;
    if (balanceChanges[transaction.to] === undefined) balanceChanges[transaction.to] = 0;
    balanceChanges[transaction.from] -= +transaction.value;
    balanceChanges[transaction.to] += +transaction.value;
  });
  return balanceChanges;
};

/** 
 * @description Get address with most balance changes
 * @param {number} countBlocks How many blocks to process
 * @return {string} Most changed address
 */ 
let getMostChangedAddress = async countBlocks => {
  let lastBlockNumber = 0x0;
  let addressChanges = {};
  try {
    lastBlockNumber = await etherscan.getLastBlockNumber();
    console.log(`Last block number is ${lastBlockNumber}`);
  } catch (err) {
    throw new Error(`Error getting last block number: ${err}`);
  }
  try {
    for (let blockNumber = lastBlockNumber; blockNumber > lastBlockNumber - countBlocks; blockNumber--)
      addressChanges = await calculateBalanceChanges(
        blockNumber,
        addressChanges
      );
    let mostChangedAddress = "0x0";
    let mostChangedValue = -1;
    for (address in addressChanges) {
      if (Math.abs(addressChanges[address]) > mostChangedValue) {
        mostChangedAddress = address;
        mostChangedValue = Math.abs(addressChanges[address]);
      }
    }
    return mostChangedAddress;
  } catch (err) {
    throw new Error(`Error calculate balance changes: ${err}`);
  }
};

module.exports = { getMostChangedAddress };
