// This file stores web3 related constants such as addresses, token definitions, ETH currency references and ABI's

import { ChainId, Token } from 'trustless-swap-sdk'

// Addresses

export const POOL_FACTORY_CONTRACT_ADDRESS =
    '0x1d12AC81710da54A50e2e9095E20dB2D915Ce3C8'
export const NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS =
    '0x7D9D03317e90E477180dcFE28c75f8007Ecc6031'
// Currencies and Tokens

export const WETH_TOKEN= new Token(
    1,
    '0x111808AbE352c8003e0eFfcc04998EaB26Cebe3c',
    18,
    'token1',
    'token1',
)

export const WBTC_TOKEN =
    new Token(
    1,
    '0x43bDa480DE297A14cec95bFb1C6A313615f809Ef',
    18,
    'tk2',
    'tk2'
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
