// const fs = require('fs');
// require('@nomicfoundation/hardhat-toolbox');

// const privateKey = fs.readFileSync('.secret').toString().trim();

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   defaultNetwork: 'polygon_mumbai',
//   networks: {
//     hardhat: {},
//     polygon_mumbai: {
//       url: 'https://polygon-mumbai.g.alchemy.com/v2/zCf8lwKtELkxGJEg9S2xK9sKVTJFzhB3',
//       accounts: [`0x${privateKey}`],
//     },
//   },
//   solidity: '0.8.9',
// };

// Production Configuration
require('@nomiclabs/hardhat-ethers');

module.exports = {
	defaultNetwork: 'matic',
	networks: {
		hardhat: {},
		matic: {
			url: process.env.NEXT_PUBLIC_ALCHEMY_API_URL,
			accounts: [process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY],
		},
	},
	solidity: {
		version: '0.8.9',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	paths: {
		sources: './contracts',
		tests: './test',
		cache: './cache',
		artifacts: './artifacts',
	},
	mocha: {
		timeout: 20000,
	},
};
