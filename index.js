const etherscanBalances = require("./src/index");

etherscanBalances
  .getMostChangedAddress(100)
  .then(address => console.log(`Address with most changes is ${address}`))
  .catch(err => console.log(err));
