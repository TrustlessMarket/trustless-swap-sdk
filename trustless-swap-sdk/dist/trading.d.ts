import { TradeType } from './constants';
import { Token } from './entities/token';
import { Trade } from './entities/trade';
import { TransactionState } from './providers';
import { IToken } from './interfaces/token';
export interface IPagingParams {
    limit?: number;
    page?: number;
    is_test?: string;
    network?: string;
}
export interface IListTokenParams {
    is_test?: string;
    from_token?: string;
    network?: string;
}
export declare const camelCaseKeys: (obj: any) => any;
export declare const swrFetcher: (url: string, options: any) => Promise<any>;
export declare function getListRoute(from: string, to: string): Promise<any[]>;
export declare const getSwapTokensV1: (params: any) => Promise<IToken[]>;
export interface ISwapRouteParams {
    from_token: string;
    to_token: string;
    network?: string;
}
export declare const getSwapRoutesV2: (params: any) => Promise<any>;
export declare function gettokenIndex(listToken: any[], address: string): number;
export declare type TokenTrade = Trade<Token, Token, TradeType>;
export declare const getBestRouteExactIn: (amountIn: any, swapRoutes?: any[], listToken1?: IToken[]) => Promise<any[]>;
export declare const getBestRouteExactOut: (amountOut: any, swapRoutes?: any[], listToken1?: IToken[]) => Promise<any[]>;
export declare function createTrade(): Promise<TokenTrade>;
export declare function executeTradeSlippage(trade: TokenTrade, slippage: number, recipient?: any): Promise<any>;
export declare function executeTrade(trade: TokenTrade): Promise<TransactionState>;
export declare function setTokens(listTk: any[]): void;
export declare function getTokenTransferApprovalSwap(token: Token): Promise<number>;
export declare function tokenTransferApproval(token: Token, amount?: number): Promise<TransactionState>;
export declare const getGasFee: () => Promise<number>;
export declare const DEFAULT_GAS_PRICE = 1000000000;
export declare const getDefaultGasPrice: () => number;
