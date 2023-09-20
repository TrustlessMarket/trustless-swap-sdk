import { Token } from './entities/token';
import { Pool } from './entities/pool';
import { ethers } from 'ethers';
import { FeeAmount } from './constants';
interface PoolInfo {
    token0: string;
    token1: string;
    fee: number;
    tickSpacing: number;
    sqrtPriceX96: ethers.BigNumber;
    liquidity: ethers.BigNumber;
    tick: number;
}
export declare function getPoolInfoByToken(tokenIn: Token, tokenOut: Token, poolFee: number): Promise<Pool>;
export declare function getPoolInfo(tokenIn: Token, tokenOut: Token, poolFee: number): Promise<PoolInfo>;
export declare function encodePath(path: string[], fees: FeeAmount[]): string;
export {};
