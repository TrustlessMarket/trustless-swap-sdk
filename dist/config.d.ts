import { Token } from './entities/token';
import { FeeAmount } from './constants';
export declare enum ETypes {
    'issue' = 0,
    'buy' = 1,
    'sell' = 2,
    'approve' = 3,
    'update_creator_fee' = 4,
    'withdraw' = 5,
    'createTournament' = 6,
    'add_watch_list' = 7,
    'remove_watch_list' = 8,
    'swap_tokens' = 9,
    'transfer' = 10,
    'swap_eth_key' = 11
}
export declare type TokenType = 'BTC' | 'ETH';
export declare function encodePriceSqrt(reserve1: number, reserve0: number): BigInt;
export declare function priceToSqrtPrice(price: number): BigInt;
export declare const typeToFee: {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
    10: number;
    11: number;
};
export declare enum Environment {
    LOCAL = 0,
    TESTNET = 1,
    MAINNET = 2,
    NAKATESTNET = 3,
    NAKAMAINNET = 4
}
export declare enum WalletType {
    EXTENSION = 0,
    PRIVATEKEY = 1
}
export interface EnvironmentConfig {
    env: Environment;
    rpc: string;
    network: string;
    swapApi: string;
    API_ROOT: string;
    POOL_FACTORY_CONTRACT_ADDRESS: string;
    QUOTER_CONTRACT_ADDRESS: string;
    SWAP_ROUTER_ADDRESS: string;
    WETH_CONTRACT_ADDRESS: string;
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS: string;
    TC_CONTRACT_ADDRESS: string;
    ALPHA_CONTRACT_ADDRESS: string;
    tokens_list: Array<Token>;
    chainName: string;
}
export declare const testnetConfig: EnvironmentConfig;
export declare const nakatestnetConfig: EnvironmentConfig;
export declare const nakamainnetConfig: EnvironmentConfig;
export declare const mainnetConfig: EnvironmentConfig;
export declare let CurrentConfig: EnvironmentConfig;
export declare let tokenSwap: {
    in: Token;
    amountIn: number;
    out: Token;
    poolFee: FeeAmount;
};
export declare let tokenLiquidity: {
    token0: Token;
    token0Amount: number;
    token1: Token;
    token1Amount: number;
    poolFee: FeeAmount;
    fractionToRemove: number;
    fractionToAdd: number;
};
export declare function setTOkenSwap(inputToken: Token, amountIn: number, outToken: Token, poolFee: number): void;
export declare function setTOkenIn(inputToken: Token): void;
export declare function setTOkenOut(outToken: Token): void;
export declare function resetTOkenSwap(): void;
export declare function choiceConFig(environment: number): void;
export declare function setConfig(config: EnvironmentConfig): void;
export interface walletConfig {
    address: string;
    privateKey: string;
    type: WalletType;
}
export declare let CurrentWallet: walletConfig;
export declare function changeWallet(type: WalletType, address: string, privateKey: string): void;
