const hre = require('hardhat');

async function main() {
	const NFTMarketplace = await hre.ethers.getContractFactory(
		'NFTMarketplaceTest3'
	);
	const nftMarketplace = await NFTMarketplace.deploy();

	await nftMarketplace.deployed();

	console.log(
		'NFTMarketplaceTest3 with 1 ETH deployed to:',
		nftMarketplace.address
	);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
