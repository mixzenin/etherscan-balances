const lib = require("./src/index");

lib
  .getMostChangedAddress(100) // Кол-во т последних блоков
  .catch(err => console.log(err));
