const etherscan = require("./etherscan");

let calculateBalanceChanges = async (
  addresses,
  countBlocks,
  lastBlockNumber
) => {
  return new Promise(async (resolve, reject) => {
    let transactionsInBlock = [];
    try {
      const blockNumber = (lastBlockNumber - countBlocks + 1).toString(16); // countBlocks + 1, т.к. влючаем последний блок
      transactionsInBlock = await etherscan.getTransactionsInBlock(blockNumber);
      console.log(
        `Transactions in block 0x${blockNumber} received, blocks left: ${countBlocks -
          1}`
      );
    } catch (err) {
      reject(err);
    }
    transactionsInBlock.forEach(transaction => {
      // Если адрес отправителя не был записан ранее
      if (addresses[transaction.from] === undefined)
        addresses[transaction.from] = 0;
      // Если адрес получателя не был записан ранее
      if (addresses[transaction.to] === undefined)
        addresses[transaction.to] = 0;
      // Увеличиваем разницу для этого адреса
      addresses[transaction.from] += Math.abs(+transaction.value);
      addresses[transaction.to] += Math.abs(+transaction.value);
    });
    // Если блоков для проверки не осталось - заканчиваем рекурсию
    if (countBlocks - 1 > 0)
      await calculateBalanceChanges(
        addresses,
        countBlocks - 1,
        lastBlockNumber
      );
    else {
      let mostChangedAddress = "0x0";
      let mostChangedValue = -1;
      for (address in addresses) {
        if (addresses[address] > mostChangedValue) {
          mostChangedAddress = address;
          mostChangedValue = addresses[address];
        }
      }
      console.log(`Address with most changes is ${mostChangedAddress}. Balance changed to ${mostChangedValue / 10 ** 18} eth`);
      resolve(mostChangedAddress);
    }
  });
};

let getMostChangedAddress = async countBlocks => {
  return new Promise(async (resolve, reject) => {
    let lastBlockNumber = 0x0;
    // Узнаем номер последнего блока
    try {
      lastBlockNumber = await etherscan.getLastBlockNumber();
      console.log(`Last block number is ${lastBlockNumber}`);
    } catch (err) {
      reject(`Error getting last block number: ${err}`);
    }
    // Вызываем функцию подсчета наиболее изменяемого адреса
    try {
      const resultAddress = await calculateBalanceChanges(
        {},
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
