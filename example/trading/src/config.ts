import { Token,FeeAmount } from 'trustless-swap-sdk'

//import { USDC_TOKEN, WETH_TOKEN } from './constants'

// Sets if the example should run locally or on chain
export enum Environment {
  LOCAL,
  TESTNET,
  MAINNET,
}

// Inputs that configure this example to run
export interface EnvironmentConfig {
  env: Environment
  rpc:string
  POOL_FACTORY_CONTRACT_ADDRESS:string
  QUOTER_CONTRACT_ADDRESS:string
  SWAP_ROUTER_ADDRESS:string
  WETH_CONTRACT_ADDRESS:string
  tokens_list: Array<Token>
}

// Example Configuration

export const testnetConfig: EnvironmentConfig = {
  env: Environment.TESTNET,
  rpc:'https://l2-node.regtest.trustless.computer',
  POOL_FACTORY_CONTRACT_ADDRESS:'0x9D921bF7460d1FcfF77d88edd4D34cD1e2F56BDc',
  QUOTER_CONTRACT_ADDRESS:'0xD228465a3E1C64Ed6C627a87132dc6b1552cd0F2',
  SWAP_ROUTER_ADDRESS:'0x3a3885F7a03beC1F4A1c00f155A5d57168fDE205',
  WETH_CONTRACT_ADDRESS:'0x0fba66555b74f13809862bd6f15fffa0a0237059',
  tokens_list:[
    new Token(
        1,
        '0x0FBa66555B74F13809862BD6f15FffA0A0237059',
        18,
        'WETH',
        'Wrapped Ether'),
    new Token(
        1,
        '0xB68BB951883A7c5f24C7e2Cca8d9A68CFC606F41',
        18,
        'USDC',
        'USD//C'
    ),
    new Token(
        1,
        '0x1d45c32C97707C916b350042CEAC2164fb6D00A1',
        18,
        'WBTC',
        'Wrapped BTC'
    )
  ]
}
export const mainnetConfig: EnvironmentConfig = {
  env: Environment.MAINNET,
  rpc:'https://node.l2.trustless.computer',
  POOL_FACTORY_CONTRACT_ADDRESS:'0x1d12AC81710da54A50e2e9095E20dB2D915Ce3C8',
  QUOTER_CONTRACT_ADDRESS:'0x17f8275c3842f977d42Ab09c35042ddE4ec55856',
  SWAP_ROUTER_ADDRESS:'0xB3eAc9358462356B231801309f553c48667B2CB7',
  WETH_CONTRACT_ADDRESS:'0x43bda480de297a14cec95bfb1c6a313615f809ef',
  tokens_list:[
    new Token(
        1,
        '0x43bda480de297a14cec95bfb1c6a313615f809ef',
        18,
        'WETH',
        'Wrapped Ether'),
    new Token(
        1,
        '0x53C653CFF22134bC332Dd0fC6Ce840a9Fe0F05d6',
        18,
        'USDC',
        'USD//C'
    )
    ,
    new Token(
        1,
        '0xdb380837095fbfAA4Ea65e7388Ef35A5FCad0334',
        18,
        'WBTC',
        'Wrapped BTC'
    )
  ]
}
export let CurrentConfig = testnetConfig

export let tokenSwap ={
in: CurrentConfig.tokens_list[0],
      amountIn: 1,
      out: CurrentConfig.tokens_list[2],
      poolFee: FeeAmount.MEDIUM,
}
export function setTOkenSwap(inputToken: Token,amountIn: number,outToken: Token, poolFee:number)  {
  tokenSwap ={
    in: inputToken,
    amountIn: amountIn,
    out: outToken,
    poolFee:poolFee,
  }
}

export function resetTOkenSwap()
{
  tokenSwap ={
    in: CurrentConfig.tokens_list[0],
    amountIn: 1,
    out: CurrentConfig.tokens_list[2],
    poolFee: FeeAmount.MEDIUM,
  }
}

export function choiceConFig(environment: number)  {
  if (environment == Environment.TESTNET){
    CurrentConfig = testnetConfig
  }
  else if(environment == Environment.MAINNET){
    CurrentConfig = mainnetConfig
  }
  resetTOkenSwap()
}

export interface walletConfig{
  address: string
  privateKey: string
}

export let CurrentWallet:walletConfig =
{
  address: '',
  privateKey:
  '',
}
export function changeWallet(address: string,privateKey: string)  {
  CurrentWallet.address = address
  CurrentWallet.privateKey = privateKey
}



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

export const WETH_ABI = [
  // Wrap ETH
  'function deposit() payable',

  // Unwrap ETH
  'function withdraw(uint wad) public',
]

// Transactions

export const MAX_FEE_PER_GAS = 100000000000
export const MAX_PRIORITY_FEE_PER_GAS = 100000000000
export const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 2000



