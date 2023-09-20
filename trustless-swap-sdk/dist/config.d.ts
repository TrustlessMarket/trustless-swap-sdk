import { Token } from './entities/token';
import { FeeAmount } from './constants';
export declare enum Environment {
    LOCAL = 0,
    TESTNET = 1,
    MAINNET = 2
}
export declare enum WalletType {
    EXTENSION = 0,
    PRIVATEKEY = 1
}
export interface EnvironmentConfig {
    env: Environment;
    rpc: string;
    API_ROOT: string;
    POOL_FACTORY_CONTRACT_ADDRESS: string;
    QUOTER_CONTRACT_ADDRESS: string;
    SWAP_ROUTER_ADDRESS: string;
    WETH_CONTRACT_ADDRESS: string;
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS: string;
    TC_CONTRACT_ADDRESS: string;
    tokens_list: Array<Token>;
}
export declare const testnetConfig: EnvironmentConfig;
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
export interface walletConfig {
    address: string;
    privateKey: string;
    type: WalletType;
}
export declare let CurrentWallet: walletConfig;
export declare function changeWallet(type: WalletType, address: string, privateKey: string): void;
