# Solarsoft-Station: mintOnEVM

This repository, configured with HardHat, presents a foundation for deploying an NFT Collection(ERC721A precisely) to any EVM test network. The commands can be replicated with certain adjustments for the respective main networks.


| :exclamation:  ** WARNING None of the contracts are audited!  |
|-----------------------------------------|

### Completed (but unreviewed) contracts:
- `test.sol`: Based off [EIP721A](https://www.erc721a.org/) and [EIP2981](https://eips.ethereum.org/EIPS/eip-2981)

### Uncompleted:
- `music.sol`: Based off [TBD](https://nebulawallet.io)


# Table Of Contents
- [MINT ON EVM](#Solarsoft-Station-mintOnEVM)
    - [Completed (but unreviewed) ERC721 contracts:](#completed-but-unreviewed-ERC721-contracts)
    - [Uncompleted:](#uncompleted)
- [Table Of Contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Quickstart](#quickstart)
- [Usage](#usage)
  - [Deploying Contracts](#deploying-contracts)
  - [Run a Local Network](#run-a-local-network)
  - [Using a Testnet or Live Network (like Mainnet or Polygon)](#using-a-testnet-or-live-network-like-mainnet-or-polygon)
    - [Goerli Ethereum Testnet Setup](#goerli-ethereum-testnet-setup)
  - [Verifying Contracts](#verifying-contracts)
  - [Interacting with Deployed Contracts](#interacting-with-deployed-contracts)
- [Code Formating](#code-formating)
- [Contributing](#contributing)
- [Thank You!](#thank-you)
- [Resources](#resources)


# Getting Started 

It's recommended that you've gone through the [hardhat getting started documentation](https://hardhat.org/getting-started/) before proceeding here. 

## Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- [Nodejs](https://nodejs.org/en/)
  - You'll know you've installed nodejs right if you can run:
    - `node --version`and get an ouput like: `vx.x.x`
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) instead of `npm`
  - You'll know you've installed yarn right if you can run:
    - `yarn --version` And get an output like: `x.x.x`
    - You might need to install it with npm

> If you're familiar with `npx` and `npm` instead of `yarn`, you can use `npx` for execution and `npm` for installing dependencies. 

## Quickstart

1. Clone and install dependencies

After installing all the requirements, run the following:

```bash
git clone https://github.com/solarsoft-station/mintOnEVM.git
cd mintOnEVM
```
Then:
```
yarn
```

or
```
npm i
```

2. You can now do stuff!

```
yarn hardhat test
```

or

```
npx hardhat test
```


# Usage

If you run `yarn hardhat --help` you'll get an output of all the tasks you can run. 

## Deploying Contracts

```
yarn hardhat deploy
```

This will deploy your contracts by default to a local network. Additionally, you can specify the network to deploy the contracts to with, 

```
yarn hardhat deploy --network <NETWORK>

yarn hardhat run scripts/deploy.js --network <NETWORK>
```


Here, the network name and parameters should have been set in your `hardhat.config.js`, and the deployment variables set in the `scripts/deploy.js`

## Run a Local Network

One of the best ways to test and interact with smart contracts is with a local network. To run a local network with all your contracts in it, run the following:

```
yarn hardhat node
```

You'll get a local blockchain, private keys, localnet eth, and contracts deployed (from the `deploy` folder scripts), and an endpoint to potentially add to an EVM wallet. 


## Using a Testnet or Live Network (like Mainnet or Polygon)

In your `hardhat.config.js` you'll see section like:

```
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
```

This section of the file is where you define which networks you want to interact with. You can read more about that whole file in the [hardhat documentation.](https://hardhat.org/config/)

To interact with a live or test network, you'll need:

1. An rpc URL 
2. A Private Key
3. ETH (either testnet or real)

Let's look at an example of setting these up using the Goerli testnet. 

### Goerli Ethereum Testnet Setup

First, we will need to set environment variables. We can do so by setting them in our `.env` file (create it if it's not there). You can also read more about [environment variables](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html) from the linked twilio blog. You'll find a sample of what this file will look like in `.env.example`

> IMPORTANT: MAKE SURE YOU'D DONT EXPOSE THE KEYS YOU PUT IN THIS `.env` FILE. By that, I mean don't push them to a public repo, and please try to keep them keys you use in development not associated with any real funds. 

1. Set your `GOERLI_RPC_URL` [environment variable.](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html)

You can get one for free from [Alchmey](https://www.alchemy.com/), [Infura](https://infura.io/), or [Moralis](https://moralis.io/speedy-nodes/). This is your connection to the blockchain. 

2. Set your `gPRIVATE_KEY` environment variable. 

This is your private key from your wallet, e.g [Nebula](https://nebulawallet.io) or [MetaMask](https://metamask.io/). This is needed for deploying contracts to public networks. You can optionally set your `MNEMONIC` environment variable instead with some changes to the `hardhat.config.js`.

![WARNING](https://via.placeholder.com/15/f03c15/000000?text=+) **WARNING** ![WARNING](https://via.placeholder.com/15/f03c15/000000?text=+)

When developing, it's best practice to use a wallet that isn't associated with any real money. A good way to do this is to make a new browser profile (on Chrome, Brave, Firefox, etc) and install the wallet extension on that brower, and never send this wallet money.  

Don't commit and push any changes to .env files that may contain sensitive information, such as a private key! If this information reaches a public GitHub repository, someone can use it to check if you have any Mainnet funds in that wallet address, and steal them!

`.env` example:
```
GOERLI_RPC_URL='www.infura.io/asdfadsfafdadf'
gPRIVATE_KEY='abcdef'
```
`bash` example
```
export GOERLI_RPC_URL='www.infura.io/asdfadsfafdadf'
export gPRIVATE_KEY='abcdef'
```

> You can also use a `MNEMONIC` instead of a `PRIVATE_KEY` environment variable by uncommenting the section in the `hardhat.config.js`, and commenting out the `PRIVATE_KEY` line. However this is not recommended. 

For other networks like mainnet and polygon, you can use different environment variables for your RPC URL and your private key. See the `hardhat.config.js` to learn more. 

3. Get some Testnet ETH

A faucet, like a tap, drips testnet coins and sometimes tokens. [Find a faucet](https://www.alchemy.com/overviews/what-are-testnets) with Alchemy or use [Chainlink faucets](https://faucets.chain.link/) to get some ETH and LINK. Please follow [the chainlink documentation](https://docs.chain.link/docs/acquire-link/) if unfamiliar. 

## Verifying Contracts

```
yarn hardhat run scripts/verify.js --network <NETWORK>
```

This will verify your contracts to a specified network. Additionally, 

```
yarn hardhat run scripts/deployAndVerify.js --network <NETWORK>
```

will deploy and verify your contracts to the specified network and blockexplorer. If you'd like to interact with your deployed contracts, skip down to [Interacting with Deployed Contracts](#interacting-with-deployed-contracts).

Ensure you fill in your contracts details in the `scripts/verify.js` or `scripts/deployAndVerify.js`

# Interacting With Deployed Contracts

TBA...


# Code Formating

This will format both your javascript and solidity to look nicer. 

```
yarn format

```

# Contributing

Contributions are always welcome! Open a PR or an issue!

# Thank You!

# Resources

- [Hardhat Documentation](https://hardhat.org/getting-started/)
- [Solidity by Example](https://solidity-by-example.org/)
- [EIP721A](https://www.erc721a.org/)
- [EIP2981](https://eips.ethereum.org/EIPS/eip-2981)