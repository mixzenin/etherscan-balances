const etherscan = require("./etherscan");

let calculateBalanceChanges = (
  countBlocks,
  lastBlockNumber,
  addresses = {},
) => {
  return new Promise(async (resolve, reject) => {
    let transactionsInBlock = [];
    try {
      const blockNumber = (lastBlockNumber - countBlocks + 1).toString(16);
      transactionsInBlock = await etherscan.getTransactionsInBlock(blockNumber);
      console.log(
        `Transactions in block 0x${blockNumber} received, blocks left: ${countBlocks -
          1}`
      );
    } catch (err) {
      reject(err);
    }
    transactionsInBlock.forEach(transaction => {
      if (addresses[transaction.from] === undefined)
        addresses[transaction.from] = 0;
      if (addresses[transaction.to] === undefined)
        addresses[transaction.to] = 0;
      addresses[transaction.from] -= +transaction.value;
      addresses[transaction.to] += +transaction.value;
    });
    if (countBlocks - 1 > 0)
      await calculateBalanceChanges(
        countBlocks - 1,
        lastBlockNumber,
        addresses,
      );
    else {
      let mostChangedAddress = "0x0";
      let mostChangedValue = -1;
      for (address in addresses) {
        if (Math.abs(addresses[address]) > mostChangedValue) {
          mostChangedAddress = address;
          mostChangedValue = Math.abs(addresses[address]);
        }
      }
      console.log(`Address with most changes is ${mostChangedAddress}. Balance changed to ${mostChangedValue / 10 ** 18} eth`);
      resolve(mostChangedAddress);
    }
  });
};

let getMostChangedAddress = countBlocks => {
  return new Promise(async (resolve, reject) => {
    let lastBlockNumber = 0x0;
    try {
      lastBlockNumber = await etherscan.getLastBlockNumber();
      console.log(`Last block number is ${lastBlockNumber}`);
    } catch (err) {
      reject(`Error getting last block number: ${err}`);
    }
    try {
      const resultAddress = await calculateBalanceChanges(
        countBlocks,
        lastBlockNumber
      );
      resolve(resultAddress);
    } catch (err) {
      reject(`Error calculate balance changes: ${err}`);
    }
  });
};

module.exports = { getMostChangedAddress };
