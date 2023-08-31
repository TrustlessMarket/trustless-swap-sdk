import { Token } from './entities/token'
import {Trade } from './entities/trade'
import {  TradeType } from './constants'
import { BigNumber, ethers } from 'ethers'

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
  return `${trade.inputAmount.toExact()} ${
      trade.inputAmount.currency.symbol
  } for ${trade.outputAmount.toExact()} ${trade.outputAmount.currency.symbol}`
}
