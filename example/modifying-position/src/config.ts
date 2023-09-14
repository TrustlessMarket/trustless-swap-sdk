import { Token,FeeAmount } from 'trustless-swap-sdk'
import {WBTC_TOKEN, WETH_TOKEN} from "./libs/constants"

// Sets if the example should run locally or on chain
export enum Environment {
  LOCAL,
  WALLET_EXTENSION,
  MAINNET,
}

// Inputs that configure this example to run
export interface ExampleConfig {
  env: Environment
  rpc: {
    local: string
    mainnet: string
  }
  wallet: {
    address: string
    privateKey: string
  }
  tokens: {
    token0: Token
    token0Amount: number
    token1: Token
    token1Amount: number
    poolFee: FeeAmount
    fractionToRemove: number
    fractionToAdd: number
  }
}

// Example Configuration

export const CurrentConfig: ExampleConfig = {
  env: Environment.WALLET_EXTENSION,
  rpc: {
    local: 'https://node.l2.trustless.computer',
    mainnet: 'https://node.l2.trustless.computer',
  },
  wallet: {
    address: '0x3B6c50437765f996A609eA479766141BB7903761',
    privateKey:
        'c46e21b81b8b70e0fdcbd537a9dd52fccd86a116ea2e998b2163ba51cd3c9bc4',
  },
  tokens: {
    token0: WETH_TOKEN,
    token0Amount: 0.5,
    token1: WBTC_TOKEN,
    token1Amount: 0.2,
    poolFee: FeeAmount.MEDIUM,
    fractionToRemove: 1,
    fractionToAdd: 0.5,
  },
}
