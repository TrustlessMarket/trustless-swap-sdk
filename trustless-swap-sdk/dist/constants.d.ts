import JSBI from 'jsbi';
import { BigNumber } from 'ethers';
export declare type BigintIsh = JSBI | string | number;
export declare enum TradeType {
    EXACT_INPUT = 0,
    EXACT_OUTPUT = 1
}
export declare enum Rounding {
    ROUND_DOWN = 0,
    ROUND_HALF_UP = 1,
    ROUND_UP = 2
}
export declare const MaxUint256: JSBI;
export declare const MaxUint128: BigNumber;
export declare enum FeeAmount {
    LOWEST = 100,
    LOW = 500,
    MEDIUM = 3000,
    HIGH = 10000
}
/**
 * The default factory tick spacings by fee amount.
 */
export declare const TICK_SPACINGS: {
    [amount in FeeAmount]: number;
};
export declare const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export declare const POOL_INIT_CODE_HASH = "0x04759a882be3a45ff74719de5c82516d29af4b3480d076fc0c57b2fdab813bc7";
export declare const FACTORY_ADDRESS = "0x9D921bF7460d1FcfF77d88edd4D34cD1e2F56BDc";
export declare const ERC20_ABI: string[];
export declare const WETH_ABI: string[];
export declare const NONFUNGIBLE_POSITION_MANAGER_ABI: string[];
export declare const MAX_FEE_PER_GAS = 100000000000;
export declare const MAX_PRIORITY_FEE_PER_GAS = 100000000000;
export declare const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 2000;
