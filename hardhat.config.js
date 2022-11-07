require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
      },
      {
        version: "0.6.6",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // If you want to do some forking set `enabled` to true
      forking: {
        url: process.env.MAINNET_RPC_URL,
        blockNumber: process.env.FORKING_BLOCK_NUMBER || undefined,
        enabled: true,
      },
      chainId: 31337, //this sortof imposes hardhat's default chainId on the forked chain
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    customNetwork: {
      url: "",
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "test",
      },
    },
    matic: {
      url: process.env.POLYGON_RPC_URL,
      accounts: [process.env.pPRIVATE_KEY] || undefined,
      chainId: 137,
    },
    mumbai: {
      url: process.env.QUICKNODE_HTTP_URL,
      accounts: [process.env.mPRIVATE_KEY],
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL || "",
      accounts:
        process.env.gPRIVATE_KEY !== undefined
          ? [process.env.gPRIVATE_KEY]
          : ["putprivateKeyHere"],
      chainId: 5,
    },
    // rinkeby: {
    //   url: process.env.RINKEBY_RPC_URL,
    //   accounts:
    //     process.env.rPRIVATE_KEY !== undefined
    //       ? [process.env.rPRIVATE_KEY]
    //       : ["putprivateKeyHere"],
    //   chainId: 4,
    // },
    mainnet: {
      url: process.env.MAINNET_RPC_URL,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 1,
  },

  },
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGONSCAN_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY, //all etherscan networks use the same apiKey
      rinkeby: process.env.ETHERSCAN_API_KEY,
      mainnet: process.env.ETHERSCAN_API_KEY, //all etherscan networks use the same apiKey

    },
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS,
    currency: "USD",
    // outputFile: "gas-report.txt",
    // noColors: false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  // namedAccounts: {
  //   deployer: {
  //     default: 0, // here this will by default take the first account as deployer
  //     1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
  //   },
  // },
};
