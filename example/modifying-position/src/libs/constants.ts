// This file stores web3 related constants such as addresses, token definitions, ETH currency references and ABI's

import { ChainId, Token } from 'trustless-swap-sdk'

// Addresses

export const POOL_FACTORY_CONTRACT_ADDRESS =
    '0x9D921bF7460d1FcfF77d88edd4D34cD1e2F56BDc'
export const NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS =
    '0xe6Dc33d13200f0A9CF7cFC7B484aE1891D934234'
// Currencies and Tokens

export const WETH_TOKEN = new Token(
    ChainId.MAINNET,
    '0x0FBa66555B74F13809862BD6f15FffA0A0237059',
    18,
    'WETH',
    'WETH'
)

export const WBTC_TOKEN = new Token(
    ChainId.MAINNET,
    '0x1d45c32C97707C916b350042CEAC2164fb6D00A1',
    18,
    'WBTC',
    'WBTC'
)

// Transactions

export const MAX_FEE_PER_GAS = '100000000000'
export const MAX_PRIORITY_FEE_PER_GAS = '100000000000'
export const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 1000000000000

// ABI's

export const ERC20_ABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',
  'function approve(address _spender, uint256 _value) returns (bool)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
]

export const NONFUNGIBLE_POSITION_MANAGER_ABI = [
  // Read-Only Functions
  'function balanceOf(address _owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address _owner, uint256 _index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string memory)',

  'function positions(uint256 tokenId) external view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)',
]
