import { Token } from './entities/token';
import { Trade } from './entities/trade';
import { TradeType } from './constants';
import { BigNumber } from 'ethers';
export declare function fromReadableAmount(amount: number, decimals: number): BigNumber;
export declare function toReadableAmount(rawAmount: number, decimals: number): string;
export declare function displayTrade(trade: Trade<Token, Token, TradeType>): string;
export declare function formatPriceToPriceSqrt(price: string): BigNumber;
