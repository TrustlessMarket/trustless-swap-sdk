import { ethers } from 'ethers'
import { TradeType,Token,Currency,CurrencyAmount,Pool,Route,Trade,SwapQuoter,SwapOptions,SwapRouter,Percent } from 'trustless-swap-sdk'

import JSBI from 'jsbi'

import {
  ERC20_ABI,
  tokenSwap,
  CurrentConfig,
  TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS,setSwap1,setSwap2
} from './config'
import { getPoolInfo,getPoolInfoByToken } from './pool'
import {
  getProvider,
  getWalletAddress,
  sendTransaction,
  TransactionState,
} from './providers'
import { fromReadableAmount,toReadableAmount } from './utils'

export type TokenTrade = Trade<Token, Token, TradeType>

// Trading Functions

export async function createTrade(iSIN:boolean):  Promise<TokenTrade> {
  if (iSIN){
    setSwap1()
  }
  else {
    setSwap2()
  }

  const poolInfo = await getPoolInfo()

  const pool = new Pool(
      tokenSwap.in,
      tokenSwap.out,
      tokenSwap.poolFee,
      poolInfo.sqrtPriceX96.toString(),
      poolInfo.liquidity.toString(),
      poolInfo.tick
  )

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

  console.log(uncheckedTrade.outputAmount.toExact())

  // Format with proper units (approximate)
  return  uncheckedTrade

  /*

  console.log(parseFloat(uncheckedTrade.outputAmount.toExact())<minrequirerateAmount1)
  if((uncheckedTrade.outputAmount.toExact())<minrequirerateAmount1){
    return false
  }

  const res = await executeTrade(uncheckedTrade)
  return true*/
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
  console.log("sent")

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
