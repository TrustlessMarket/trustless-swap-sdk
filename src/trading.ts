import { ethers } from 'ethers'
import { SwapOptions,SwapRouter } from './entities/swapRouter'
import { Percent } from './entities/fractions/percent'
import { TradeType } from './constants'
import { Token } from './entities/token'
import { Trade } from './entities/trade'
import { Currency } from './entities/currency'
import { CurrencyAmount } from './entities/fractions/currencyAmount'
import { Pool } from './entities/pool'
import { Route } from './entities/route'
import { SwapQuoter } from './entities/quoter'
import JSBI from 'jsbi'

import {
  ERC20_ABI,
  tokenSwap,
  CurrentConfig,
  TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS
} from './config'
import { getPoolInfo } from './pool'
import {
  getProvider,
  getWalletAddress,
  sendTransaction,
  TransactionState,
} from './providers'
import { fromReadableAmount } from './utils'

export type TokenTrade = Trade<Token, Token, TradeType>

// Trading Functions

export async function createTrade(): Promise<TokenTrade> {
  const poolInfo = await getPoolInfo()

  const pool = new Pool(
      tokenSwap.in,
      tokenSwap.out,
      tokenSwap.poolFee,
      poolInfo.sqrtPriceX96.toString(),
      poolInfo.liquidity.toString(),
      poolInfo.tick
  )

  console.log("poolInfo1")
  console.log(poolInfo)


  const swapRoute = new Route(
      [pool],
      tokenSwap.in,
      tokenSwap.out
  )

  const amountOut = await getOutputQuote(swapRoute)

  const uncheckedTrade = Trade.createUncheckedTrade({
    route: swapRoute,
    inputAmount: CurrencyAmount.fromRawAmount(
        tokenSwap.in,
        fromReadableAmount(
            tokenSwap.amountIn,
            tokenSwap.in.decimals
        ).toString()
    ),
    outputAmount: CurrencyAmount.fromRawAmount(
        tokenSwap.out,
        JSBI.BigInt(amountOut)
    ),
    tradeType: TradeType.EXACT_INPUT,
  })

  return uncheckedTrade
}

export async function executeTrade(
    trade: TokenTrade
): Promise<TransactionState> {
  const walletAddress = getWalletAddress()
  const provider = getProvider()

  if (!walletAddress || !provider) {
    throw new Error('Cannot execute a trade without a connected wallet')
  }
  


  // Give approval to the router to spend the token
  const tokenApproval = await getTokenTransferApproval(tokenSwap.in)

  // Fail if transfer approvals do not go through
  if (tokenApproval !== TransactionState.Sent) {
    return TransactionState.Failed
  }
  


  const options: SwapOptions = {
    slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    recipient: walletAddress,
  }

  const methodParameters = SwapRouter.swapCallParameters([trade], options)

  const tx = {
    data: methodParameters.calldata,
    to: CurrentConfig.SWAP_ROUTER_ADDRESS,
    value: methodParameters.value,
    from: walletAddress,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  }

  const res = await sendTransaction(tx)

  return res
}

// Helper Quoting and Pool Functions

async function getOutputQuote(route: Route<Currency, Currency>) {
  const provider = getProvider()

  if (!provider) {
    throw new Error('Provider required to get pool state')
  }

  const { calldata } = await SwapQuoter.quoteCallParameters(
      route,
      CurrencyAmount.fromRawAmount(
          tokenSwap.in,
          fromReadableAmount(
              tokenSwap.amountIn,
              tokenSwap.in.decimals
          ).toString()
      ),
      TradeType.EXACT_INPUT,
      {
        useQuoterV2: true,
      }
  )
  //console.log("calldata3")
 // alert(calldata)
  //console.log("calldata2")

  const quoteCallReturnData = await provider.call({
    to: CurrentConfig.QUOTER_CONTRACT_ADDRESS,
    data: calldata,
  })

  return ethers.utils.defaultAbiCoder.decode(['uint256'], quoteCallReturnData)
}

export async function getTokenTransferApproval(
    token: Token
): Promise<TransactionState> {
  const provider = getProvider()
  const address = getWalletAddress()
  if (!provider || !address) {
    console.log('No Provider Found')
    return TransactionState.Failed
  }

  try {
    const tokenContract = new ethers.Contract(
        token.address,
        ERC20_ABI,
        provider
    )

    const transaction = await tokenContract.populateTransaction.approve(
        CurrentConfig.SWAP_ROUTER_ADDRESS,
        fromReadableAmount(
            TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
            token.decimals
        ).toString()
    )

    return sendTransaction({
      ...transaction,
      from: address,
    })
  } catch (e) {
    console.error(e)
    return TransactionState.Failed
  }
}
