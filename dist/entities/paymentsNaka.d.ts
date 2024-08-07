import JSBI from 'jsbi';
import { Interface } from '@ethersproject/abi';
import { Token } from './token';
import { Percent } from './fractions/percent';
export interface FeeOptionsNaka {
    /**
     * The percent of the output that will be taken as a fee.
     */
    fee: Percent;
    /**
     * The recipient of the fee.
     */
    recipient: string;
}
export declare abstract class PaymentsNaka {
    static INTERFACE: Interface;
    /**
     * Cannot be constructed.
     */
    private constructor();
    private static encodeFeeBips;
    static encodeUnwrapWETH9(amountMinimum: JSBI, recipient: string, feeOptions?: FeeOptionsNaka): string;
    static encodeSweepToken(token: Token, amountMinimum: JSBI, recipient: string, feeOptions?: FeeOptionsNaka): string;
    static encodeRefundETH(): string;
}
