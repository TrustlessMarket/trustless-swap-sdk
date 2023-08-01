import { Token, TradeType,Trade } from 'trustless-swap-sdk'
import { BigNumber, ethers } from 'ethers'

const MAX_DECIMALS = 4

export function fromReadableAmount(
  amount: number,
  decimals: number
): BigNumber {
  return ethers.utils.parseUnits(amount.toString(), decimals)
}

export function toReadableAmount(rawAmount: number, decimals: number): string {
  return ethers.utils.formatUnits(rawAmount, decimals)
}

export function displayTrade(trade: Trade<Token, Token, TradeType>): string {
  console.log(trade.outputAmount.toExact())
  return `${trade.inputAmount.toExact()} ${
    trade.inputAmount.currency.symbol
  } for ${trade.outputAmount.toExact()} ${trade.outputAmount.currency.symbol}`
}
