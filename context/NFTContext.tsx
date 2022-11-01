import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers, BigNumber } from 'ethers';
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client';

import { NextRouter } from 'next/router';
import { MarketAddress, MarketAddressAbi } from './constants';
import { createCtx, validateEnv } from '../utils';
import { IFormInput } from '../pages/create-nft';

interface IRawNFTData {
	tokenId: BigNumber;
	seller: string;
	owner: string;
	price: BigNumber;
}

export interface INFTMetadata {
	image: string;
	name: string;
	description: string;
	price: string;
}

export interface IFormattedNFT {
	price: string;
	tokenId: number;
	seller: string;
	owner: string;
	image: string;
	name: string;
	description: string;
	tokenURI: any;
}

const projectSubdomain = validateEnv(
	'IPFS Project Subdomain',
	process.env.NEXT_PUBLIC_IPFS_SUBDOMAIN
);
const rpcUrl = validateEnv(
	'Alchemy Polygon Testnet RPC url',
	process.env.NEXT_PUBLIC_ALCHEMY_API_URL
);

const projectId = validateEnv(
	'IPFS Project Id',
	process.env.NEXT_PUBLIC_IPFS_PROJECT_ID
);
const projectSecret = validateEnv(
	'IPFS Project API secret key',
	process.env.NEXT_PUBLIC_IPFS_API_KEY
);
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString(
	'base64'
)}`;
const client = ipfsHttpClient({
	host: 'ipfs.infura.io',
	port: 5001,
	protocol: 'https',
	headers: {
		authorization: auth,
	},
});

const fetchContract = (
	signerOrProvider:
		| ethers.providers.JsonRpcSigner
		| ethers.providers.JsonRpcProvider
): ethers.Contract =>
	new ethers.Contract(MarketAddress, MarketAddressAbi, signerOrProvider);

interface NFTContextInterface {
	nftCurrency: string;
	connectWallet: () => Promise<void>;
	currentAccount: string;
	// eslint-disable-next-line no-unused-vars
	uploadToIPFS: (file: File) => Promise<string | undefined>;
	// eslint-disable-next-line no-unused-vars
	createNFT: (
		formInput: IFormInput,
		fileUrl: string,
		router: NextRouter
	) => Promise<void>;
	fetchNFTs: () => Promise<IFormattedNFT[]>;
	// eslint-disable-next-line no-unused-vars
	fetchMyNFTsOrListedNFTs: (
		type: 'fetchItemsListed' | 'fetchMyNFTs'
	) => Promise<IFormattedNFT[]>;
	// eslint-disable-next-line no-unused-vars
	buyNFT: (nft: IFormattedNFT) => Promise<void>;
	// eslint-disable-next-line no-unused-vars
	createSale: (
		url: string,
		formInputPrice: string,
		id?: string,
		isReselling?: boolean
	) => Promise<void>;
	isLoadingNFT: boolean;
}

export const [useCurrentNFTContext, NFTContextProvider] =
	createCtx<NFTContextInterface>();

export const NFTProvider = ({ children }: { children: React.ReactNode }) => {
	const nftCurrency = 'MATIC';
	const [currentAccount, setCurrentAccount] = useState('');
	const [isLoadingNFT, setIsLoadingNFT] = useState(false);

	const checkIfWalletIsConnected = async () => {
		if (!window.ethereum) return alert('Please install MetaMask');

		const accounts = await window.ethereum.request({ method: 'eth_accounts' });

		if ((accounts as string[]).length) {
			setCurrentAccount((accounts as string[])[0]);
		} else {
			console.log('No Accounts found');
		}
	};

	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

	const connectWallet = async () => {
		if (!window.ethereum) return alert('Please install MetaMask');

		const accounts = await window.ethereum.request({
			method: 'eth_requestAccounts',
		});

		setCurrentAccount((accounts as string[])[0]);

		window.location.reload();
	};

	const uploadToIPFS = async (file: File) => {
		try {
			const added = await client.add({ content: file });

			const url = `${projectSubdomain}/ipfs/${added.path}`;

			return url;
		} catch (error) {
			console.error('Error uploading file to IPFS');
			console.error(error);
		}
	};

	const createSale = async (
		url: string,
		formInputPrice: string,
		id?: string,
		isReselling = false
	) => {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		const price = ethers.utils.parseUnits(formInputPrice, 'ether');
		const contract = fetchContract(signer);

		const listingPrice = await contract.getListingPrice();
		const transaction = isReselling
			? await contract.resellToken(id, price, {
					value: listingPrice.toString(),
			  })
			: await contract.createToken(url, price, {
					value: listingPrice.toString(),
			  });

		setIsLoadingNFT(true);
		await transaction.wait();
	};

	const createNFT = async (
		formInput: IFormInput,
		fileUrl: string,
		router: NextRouter
	) => {
		const { name, price, description } = formInput;

		// eslint-disable-next-line no-useless-return
		if (!name || !price || !description || !fileUrl) return;

		const data = JSON.stringify({ name, description, image: fileUrl });

		try {
			const added = await client.add(data);

			const url = `${projectSubdomain}/ipfs/${added.path}`;

			await createSale(url, price);

			router.push('/');
		} catch (error) {
			console.error('Error uploading file to IPFS');
			console.error('Actual Error: ', error);
		}
	};

	const fetchNFTs = async (): Promise<IFormattedNFT[]> => {
		setIsLoadingNFT(false);

		const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
		const contract = fetchContract(provider);

		const data = await contract.fetchMarketItems();

		const items = await Promise.all(
			(data as IRawNFTData[]).map(
				async ({ tokenId, seller, owner, price: unformattedPrice }) => {
					const tokenURI = await contract.tokenURI(tokenId);
					const {
						data: { image, name, description },
					} = await axios.get<INFTMetadata>(tokenURI);
					// eslint-disable-next-line no-underscore-dangle
					const price = ethers.utils.formatUnits(
						unformattedPrice.toString(),
						'ether'
					);

					return {
						price,
						tokenId: tokenId.toNumber(),
						seller,
						owner,
						image,
						name,
						description,
						tokenURI,
					};
				}
			)
		);

		return items;
	};

	const fetchMyNFTsOrListedNFTs = async (
		type: 'fetchItemsListed' | 'fetchMyNFTs'
	): Promise<IFormattedNFT[]> => {
		setIsLoadingNFT(false);

		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = fetchContract(signer);

		const data =
			type === 'fetchItemsListed'
				? await contract.fetchItemsListed()
				: await contract.fetchMyNFTs();

		const items = await Promise.all(
			(data as IRawNFTData[]).map(
				async ({ tokenId, seller, owner, price: unformattedPrice }) => {
					const tokenURI = await contract.tokenURI(tokenId);
					const {
						data: { image, name, description },
					} = await axios.get<INFTMetadata>(tokenURI);
					// eslint-disable-next-line no-underscore-dangle
					const price = ethers.utils.formatUnits(
						unformattedPrice.toString(),
						'ether'
					);

					return {
						price,
						tokenId: tokenId.toNumber(),
						seller,
						owner,
						image,
						name,
						description,
						tokenURI,
					};
				}
			)
		);

		return items;
	};

	const buyNFT = async (nft: IFormattedNFT) => {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = fetchContract(signer);

		const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

		const transaction = await contract.createMarketSale(nft.tokenId, {
			value: price,
		});

		setIsLoadingNFT(true);
		await transaction.wait();
		setIsLoadingNFT(false);
	};

	return (
		<NFTContextProvider
			value={{
				nftCurrency,
				connectWallet,
				currentAccount,
				uploadToIPFS,
				createNFT,
				fetchNFTs,
				fetchMyNFTsOrListedNFTs,
				buyNFT,
				createSale,
				isLoadingNFT,
			}}
		>
			{children}
		</NFTContextProvider>
	);
};
