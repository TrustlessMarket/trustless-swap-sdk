import { BaseProvider } from '@ethersproject/providers';
import { ethers, providers } from 'ethers';
export declare function refreshProvider(provider: any): void;
export declare enum TransactionState {
    Failed = "Failed",
    New = "New",
    Rejected = "Rejected",
    Sending = "Sending",
    Sent = "Sent"
}
export declare function getMainnetProvider(): BaseProvider;
export declare function getProvider(): providers.Provider | null;
export declare function getWalletAddress(): string | null;
export declare function geSignerAddress(): Promise<string>;
export declare function sendTransaction(transaction: ethers.providers.TransactionRequest): Promise<TransactionState>;
export declare function sendTransactionGetReceipt(transaction: ethers.providers.TransactionRequest): Promise<any>;
export declare function connectBrowserExtensionWallet(provider?: any): Promise<string | null | undefined>;
export declare function sendTransactionViaExtensionGetReceipt(transaction: ethers.providers.TransactionRequest): Promise<any>;
