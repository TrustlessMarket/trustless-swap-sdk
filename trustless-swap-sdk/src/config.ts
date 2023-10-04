import { Token } from './entities/token'
import { FeeAmount } from './constants'
export enum Environment {
    LOCAL,
    TESTNET,
    MAINNET,
}
export enum WalletType {
    EXTENSION,
    PRIVATEKEY,
}

// Inputs that configure this example to run
export interface EnvironmentConfig {
    env: Environment
    rpc:string
    API_ROOT: string,
    POOL_FACTORY_CONTRACT_ADDRESS:string
    QUOTER_CONTRACT_ADDRESS:string
    SWAP_ROUTER_ADDRESS:string
    WETH_CONTRACT_ADDRESS:string
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS:string
    TC_CONTRACT_ADDRESS:string
    tokens_list: Array<Token>
    chainName: string
}

// Example Configuration

export const testnetConfig: EnvironmentConfig = {
    env: Environment.TESTNET,
    API_ROOT:"https://stag-dex-api.fprotocol.io",
    rpc:'https://l2-node.regtest.trustless.computer',
    POOL_FACTORY_CONTRACT_ADDRESS:'0x9D921bF7460d1FcfF77d88edd4D34cD1e2F56BDc',
    QUOTER_CONTRACT_ADDRESS:'0xD228465a3E1C64Ed6C627a87132dc6b1552cd0F2',
    SWAP_ROUTER_ADDRESS:'0x3a3885F7a03beC1F4A1c00f155A5d57168fDE205',
    WETH_CONTRACT_ADDRESS:'0x0fba66555b74f13809862bd6f15fffa0a0237059',
    TC_CONTRACT_ADDRESS:'0x8b485d217096cE20A09AF11D15ccCc63323C1469',
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
        )
    ],
    chainName: 'nos'
}
export const mainnetConfig: EnvironmentConfig = {
    env: Environment.MAINNET,
    rpc:'https://node.l2.trustless.computer',
    API_ROOT:"https://dex-api.fprotocol.io",
    POOL_FACTORY_CONTRACT_ADDRESS:'0x1d12AC81710da54A50e2e9095E20dB2D915Ce3C8',
    QUOTER_CONTRACT_ADDRESS:'0x17f8275c3842f977d42Ab09c35042ddE4ec55856',
    SWAP_ROUTER_ADDRESS:'0xB3eAc9358462356B231801309f553c48667B2CB7',
    WETH_CONTRACT_ADDRESS:'0x43bda480de297a14cec95bfb1c6a313615f809ef',
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS:'0x7D9D03317e90E477180dcFE28c75f8007Ecc6031',
    TC_CONTRACT_ADDRESS:'0xad771ed0f8c5df06d21a7eda3b00acd6688dd532',
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




