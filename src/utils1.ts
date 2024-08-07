import { Token } from './entities/token'
import {Trade } from './entities/trade'
import {  TradeType } from './constants'
import { BigNumber, ethers } from 'ethers'
import bn from 'bignumber.js';

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

export function formatPriceToPriceSqrt(price: string): BigNumber {
  console.log('price', price);
  alert("vao day 5")
  const sqrt = BigNumber.from(
      new bn(price.toString())
          .sqrt()
          .multipliedBy(new bn(2).pow(96))
          .integerValue(3)
          .toString(),
  );
  alert("vao day 6")

  return sqrt
}