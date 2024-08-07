import { Currency } from './entities/currency';
import { providers } from 'ethers';
export declare function getCurrencyBalance(provider: providers.Provider, address: string, currency: Currency): Promise<string>;
export declare function getCurrencyApproveRouter(provider: providers.Provider, address: string, currency: Currency): Promise<number>;
export declare function wrapETH(eth: number): Promise<void>;
export declare function unwrapETH(eth: number): Promise<void>;
