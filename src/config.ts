import { Token } from './entities/token'
import { FeeAmount } from './constants'
//import { BigNumber } from "@ethersproject/bignumber"
//import bn from "bignumber.js"

export enum ETypes {
    'issue',
    'buy',
    'sell',
    'approve',
    'update_creator_fee',
    'withdraw',
    'createTournament',
    'add_watch_list',
    'remove_watch_list',
    'swap_tokens',
    'transfer',
    'swap_eth_key',
}
export type TokenType = 'BTC' | 'ETH';

export function encodePriceSqrt(
    reserve1: number,
    reserve0: number,
): BigInt {
    const result = BigInt(Math.floor(Math.sqrt(reserve1/reserve0) * 2 ** 96))
    return result
}

export function priceToSqrtPrice(price: number):BigInt{
    const result = BigInt(Math.floor(Math.sqrt(price) * 2 ** 96))
    return result
}


export const typeToFee = {
    [ETypes.issue]: 1000000,
    [ETypes.buy]: 1000000,
    [ETypes.sell]: 1000000,
    [ETypes.approve]: 60000,
    [ETypes.update_creator_fee]: 100000,
    [ETypes.withdraw]: 2100000,
    [ETypes.createTournament]: 350000,
    [ETypes.add_watch_list]: 200000,
    [ETypes.remove_watch_list]: 70000,
    [ETypes.swap_tokens]: 2000000,
    [ETypes.transfer]: 10000,
    [ETypes.swap_eth_key]: 2000000,
};


export enum Environment {
    LOCAL,
    TESTNET,
    MAINNET,
    NAKATESTNET,
    NAKAMAINNET,
}
export enum WalletType {
    EXTENSION,
    PRIVATEKEY,
}

// Inputs that configure this example to run
export interface EnvironmentConfig {
    env: Environment
    rpc:string,
    network:string,
    swapApi:string,
    API_ROOT: string,
    POOL_FACTORY_CONTRACT_ADDRESS:string
    QUOTER_CONTRACT_ADDRESS:string
    SWAP_ROUTER_ADDRESS:string
    WETH_CONTRACT_ADDRESS:string
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS:string
    TC_CONTRACT_ADDRESS:string
    ALPHA_CONTRACT_ADDRESS:string
    tokens_list: Array<Token>
    chainName: string
}

// Example Configuration

export const testnetConfig: EnvironmentConfig = {
    env: Environment.TESTNET,
    network:"nos",
    swapApi:"swap-v3",
    API_ROOT:"https://dex-api.newbitcoincity.com",
    rpc:'https://l2-node.regtest.trustless.computer',
    POOL_FACTORY_CONTRACT_ADDRESS:'0x9D921bF7460d1FcfF77d88edd4D34cD1e2F56BDc',
    QUOTER_CONTRACT_ADDRESS:'0xD228465a3E1C64Ed6C627a87132dc6b1552cd0F2',
    SWAP_ROUTER_ADDRESS:'0x3a3885F7a03beC1F4A1c00f155A5d57168fDE205',
    WETH_CONTRACT_ADDRESS:'0x0fba66555b74f13809862bd6f15fffa0a0237059',
    TC_CONTRACT_ADDRESS:'0x8b485d217096cE20A09AF11D15ccCc63323C1469',
    ALPHA_CONTRACT_ADDRESS:'0x056e34faC103a216Ce1bBe65B75521d5C5f59037',
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS:'0xe6Dc33d13200f0A9CF7cFC7B484aE1891D934234',
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
        ),
        new Token(
            1,
            '0xe051b16b611138e45B42d74EEE10F6370B0AA9B6',
            18,
            'GM',
            'GM'
        ),
        new Token(
            1,
            '0x0F888a161Ca87a2F4dD08e1DBf38Aff80388E2AE',
            18,
            'NAKA',
            'NAKA'
        )
    ],
    chainName: 'nos'
}

export const nakatestnetConfig: EnvironmentConfig = {
    env: Environment.NAKATESTNET,
    network:"naka",
    swapApi:"swap",
    API_ROOT:"https://stag-naka-api.fprotocol.io",
    rpc:'https://l2-node.regtest.trustless.computer',
    POOL_FACTORY_CONTRACT_ADDRESS:'0x0CA45caD791CaB68BfaB71c536fD0A30384eEF64',
    QUOTER_CONTRACT_ADDRESS:'0xbC693F10C74aFf16D78AF93FDF0737d0E2cbd961',
    SWAP_ROUTER_ADDRESS:'0x7C9e6d498A3Dc8a672D6A1ddD7Acc9D6D88D63F9',
    WETH_CONTRACT_ADDRESS:'0x0fba66555b74f13809862bd6f15fffa0a0237059',
    TC_CONTRACT_ADDRESS:'0x3B9d9f8C9765c1BF7F4868c3721c136B70FD65fC',
    ALPHA_CONTRACT_ADDRESS:'0x056e34faC103a216Ce1bBe65B75521d5C5f59037',
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS:'0x48e6d71a83C969ac9CC1a93A49f74169520Dd187',
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
    ],
    chainName: 'nos'
}

export const nakamainnetConfig: EnvironmentConfig = {
    env: Environment.NAKAMAINNET,
    network:"naka",
    swapApi:"swap",
    API_ROOT:"https://api.nakachain.xyz",
    rpc:'https://node.nakachain.xyz',
    POOL_FACTORY_CONTRACT_ADDRESS:'0xB4FdCd9e30f0d418e9BbdA2Ba9B6C59123dc6b6d',
    QUOTER_CONTRACT_ADDRESS:'0xb81E3cE690DEb07AF108117E958C6C712FB1b95f',
    SWAP_ROUTER_ADDRESS:'0x53004da3353Aec99CE9546Ff9BbcEDF37E80E46b',
    WETH_CONTRACT_ADDRESS:'0xCebaA2326DF8821ac4FfE6fd8751E5f9982F4Ee5',
    TC_CONTRACT_ADDRESS:'0x87415029485119E96775D9d6C0CE1b21822CF708',
    ALPHA_CONTRACT_ADDRESS:'0x056e34faC103a216Ce1bBe65B75521d5C5f59037',
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS:'0x0f24f93043fFE43A92e4F035bA67954f1CA0B4E4',
    tokens_list:[
        new Token(
            1,
            '0xCebaA2326DF8821ac4FfE6fd8751E5f9982F4Ee5',
            18,
            'WETH',
            'Wrapped Ether'),
        new Token(
            1,
            '0x08C50bAa19d834fef4A8dd7559a6105281D1C378',
            18,
            'USDC',
            'USD//C'
        ),
        new Token(
            1,
            '0xBD0adB3Ee21e0A75D3021384177238883D69e883',
            18,
            'WBTC',
            'Wrapped BTC'
        )
    ],
    chainName: 'naka'
}

export const mainnetConfig: EnvironmentConfig = {
    env: Environment.MAINNET,
    network:"nos",
    swapApi:"swap-v3",
    rpc:'https://node.l2.trustless.computer',
    API_ROOT:"https://dex-api.newbitcoincity.com",
    POOL_FACTORY_CONTRACT_ADDRESS:'0x1d12AC81710da54A50e2e9095E20dB2D915Ce3C8',
    QUOTER_CONTRACT_ADDRESS:'0x17f8275c3842f977d42Ab09c35042ddE4ec55856',
    SWAP_ROUTER_ADDRESS:'0xB3eAc9358462356B231801309f553c48667B2CB7',
    WETH_CONTRACT_ADDRESS:'0x43bda480de297a14cec95bfb1c6a313615f809ef',
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS:'0x7D9D03317e90E477180dcFE28c75f8007Ecc6031',
    TC_CONTRACT_ADDRESS:'0xad771ed0f8c5df06d21a7eda3b00acd6688dd532',
    ALPHA_CONTRACT_ADDRESS:'0x9b727dcaC7b331f95786D3b01fA79191Ab527DA3',
    tokens_list:[
        new Token(
            1,
            '0x43bda480de297a14cec95bfb1c6a313615f809ef',
            18,
            'WETH',
            'Wrapped Ether'),
        new Token(
            1,
            '0xe8B280Ebb57bE03adC9d87e207BCD689EfADef96',
            18,
            'USDC',
            'USD//C'
        )
        ,
        new Token(
            1,
            '0x111808AbE352c8003e0eFfcc04998EaB26Cebe3c',
            18,
            'WBTC',
            'Wrapped BTC'
        )
        ,
        new Token(
            1,
            '0xdb380837095fbfAA4Ea65e7388Ef35A5FCad0334',
            18,
            'token1',
            'token1'
        ) ,
        new Token(
            1,
            '0xBBA317FD4f2Cc8b8906D77cE410691dD9a6ee64F',
            18,
            'tk3',
            'tk3'
        )
    ],
    chainName: 'nos'
}
export let CurrentConfig = mainnetConfig

export let tokenSwap ={
    in: CurrentConfig.tokens_list[0],
    amountIn: 1,
    out: CurrentConfig.tokens_list[1],
    poolFee: FeeAmount.MEDIUM,
}



export let tokenLiquidity =  {
    token0: CurrentConfig.tokens_list[3],
        token0Amount: 0.5,
        token1: CurrentConfig.tokens_list[4],
        token1Amount: 0.2,
        poolFee: FeeAmount.MEDIUM,
        fractionToRemove: 1,
        fractionToAdd: 0.5,
}


export function setTOkenSwap(inputToken: Token,amountIn: number,outToken: Token, poolFee:number)  {
    tokenSwap ={
        in: inputToken,
        amountIn: amountIn,
        out: outToken,
        poolFee:poolFee,
    }
}

export function setTOkenIn(inputToken: Token)  {
    tokenSwap["in"] = inputToken
}

export function setTOkenOut(outToken: Token)  {
    tokenSwap["out"] = outToken
}


export function resetTOkenSwap()
{
    tokenSwap ={
        in: CurrentConfig.tokens_list[0],
        amountIn: 1,
        out: CurrentConfig.tokens_list[1],
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
    else if(environment == Environment.NAKATESTNET){
        CurrentConfig = nakatestnetConfig
    }
    else if(environment == Environment.NAKAMAINNET){
        CurrentConfig = nakamainnetConfig
    }
    resetTOkenSwap()
}

export function setConfig(config: EnvironmentConfig)  {
    CurrentConfig = config
    resetTOkenSwap()
}

//type=extension,type=privatekey
export interface walletConfig{
    address: string
    privateKey: string,
    type:WalletType,
}
export let CurrentWallet:walletConfig =
    {
        address: '',
        privateKey: '',
        type:WalletType.PRIVATEKEY,
    }
export function changeWallet(type:WalletType,address: string,privateKey: string)  {
    CurrentWallet.address = address
    CurrentWallet.privateKey = privateKey
    CurrentWallet.type = type
}




