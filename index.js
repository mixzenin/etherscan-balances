const etherscanBalances = require("./src/index");

etherscanBalances
  .getMostChangedAddress(100)
  .catch(err => console.log(err));
