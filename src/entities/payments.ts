import JSBI from 'jsbi'
import { Interface } from '@ethersproject/abi'
import IPeripheryPaymentsWithFee from './IPeripheryPaymentsWithFee.json'
import {Token} from './token'
import { Percent} from './fractions/percent'
import { validateAndParseAddress } from '../utils/validateAndParseAddress'
import { toHex } from '../utils/calldata'

export interface FeeOptions {
  /**
   * The percent of the output that will be taken as a fee.
   */
  fee: Percent

  /**
   * The recipient of the fee.
   */
  recipient: string
}

export abstract class Payments {
  public static INTERFACE: Interface = new Interface(IPeripheryPaymentsWithFee.abi)

  /**
   * Cannot be constructed.
   */
  private constructor() {}

  private static encodeFeeBips(fee: Percent): string {
    return toHex(fee.multiply(10_000).quotient)
  }

  public static encodeUnwrapWETH9(amountMinimum: JSBI, recipient: string, feeOptions?: FeeOptions): string {
    recipient = validateAndParseAddress(recipient)

    if (!!feeOptions) {
      const feeBips = this.encodeFeeBips(feeOptions.fee)
      const feeRecipient: string = validateAndParseAddress(feeOptions.recipient)

      return Payments.INTERFACE.encodeFunctionData('unwrapWTCWithFee', [
        toHex(amountMinimum),
        recipient,
        feeBips,
        feeRecipient
      ])
    } else {
      return Payments.INTERFACE.encodeFunctionData('unwrapWTC', [toHex(amountMinimum), recipient])
    }
  }

  public static encodeSweepToken(
    token: Token,
    amountMinimum: JSBI,
    recipient: string,
    feeOptions?: FeeOptions
  ): string {
    recipient = validateAndParseAddress(recipient)

    if (!!feeOptions) {
      const feeBips = this.encodeFeeBips(feeOptions.fee)
      const feeRecipient: string = validateAndParseAddress(feeOptions.recipient)

      return Payments.INTERFACE.encodeFunctionData('sweepTokenWithFee', [
        token.address,
        toHex(amountMinimum),
        recipient,
        feeBips,
        feeRecipient
      ])
    } else {
      return Payments.INTERFACE.encodeFunctionData('sweepToken', [token.address, toHex(amountMinimum), recipient])
    }
  }

  public static encodeRefundETH(): string {
    return Payments.INTERFACE.encodeFunctionData('refundTC')
  }
}
