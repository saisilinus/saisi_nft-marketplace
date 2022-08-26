const fs = require('fs');
require('@nomicfoundation/hardhat-toolbox');

const privateKey = fs.readFileSync('.secret').toString().trim();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'polygon_mumbai',
  networks: {
    hardhat: {},
    polygon_mumbai: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/zCf8lwKtELkxGJEg9S2xK9sKVTJFzhB3',
      accounts: [`0x${privateKey}`],
    },
  },
  solidity: '0.8.9',
};
