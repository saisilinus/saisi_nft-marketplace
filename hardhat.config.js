require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'polygon_mumbai',
  networks: {
    hardhat: {},
    polygon_mumbai: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/zCf8lwKtELkxGJEg9S2xK9sKVTJFzhB3',
      accounts: ['0x7b7ba1058e3d6dcd0a627044c9d858610b18fa541cc6d9409642ed08ae8a5632'],
    },
  },
  solidity: '0.8.9',
};
