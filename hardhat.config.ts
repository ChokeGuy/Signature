import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-ethers';

// This adds support for typescript paths mappings
import 'tsconfig-paths/register';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  solidity: {
    compilers: [
      {
        version: '0.8.27',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
            details: {
              yul: false,
            },
          },
        },
      },
    ],
    viaIR: true,
  },
  sourcify: {
    enabled: false,
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    base_sepolia: {
      accounts: [process.env.PRIVATE_KEY!],
      url: 'https://sepolia.base.org',
      chainId: 84532,
      eid: 40245,
    },
    sepolia: {
      accounts: [process.env.PRIVATE_KEY!],
      url: 'https://sepolia.drpc.org',
      chainId: 11155111,
      eid: 40161,
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BASE_SEPOLIA_API_KEY!,
      sepolia: process.env.SEPOLIA_API_KEY!,
    },
  },
};

export default config;
