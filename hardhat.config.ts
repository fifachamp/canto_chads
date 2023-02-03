import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  // ovm: {
  //   solcVersion: "0.7.6",
  // },
  // namedAccounts: {
  //   deployer: {
  //     default: 0, // here this will by default take the first account as deployer
  //   },
  // },
  // defaultNetwork: "localhost",
  networks: {
    localhost: {
      chainId: 31337
    },
    canto_testnet: {
      url: 'https://eth.plexnode.wtf/',
      chainId: 740,
      accounts: [process.env.PK]
    },
    canto_mainnet: {
      url: 'https://canto.slingshot.finance/',
      chainId: 7700,
      accounts: [process.env.PK] 
    },
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts: [process.env.PK],
    },
  },
  gasReporter: {
    // enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
