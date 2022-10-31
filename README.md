# NFT Marketplace Project

## Installation

Clone the repo:

```bash
git clone https://github.com/saisilinus/saisi_nft-marketplace.git
cd saisi_nft-marketplace
```

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables
```

Set up .secret:

```bash
cp .secret.example .secret

# open .secret and add your private key
```

Change hardhat network configuration:

- [ ] Open hardhat.config.js
- [ ] Change networks.polygon_mumbai.url to your Alchemy API URL

Deploy the smart contract:

```bash

npm run deploy:polygon
```

## Commands

Running locally:

```bash
npm run dev
```

Running in production:

```bash
npm run start
```
