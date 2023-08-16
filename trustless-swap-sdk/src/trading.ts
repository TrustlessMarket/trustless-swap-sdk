import { ethers } from 'ethers'
import { SwapOptions,SwapRouter } from './entities/swapRouter'
import { Percent } from './entities/fractions/percent'
import { TradeType } from './constants'
import { Token } from './entities/token'
import { Trade } from './entities/trade'
import { CurrencyAmount } from './entities/fractions/currencyAmount'
import { Route } from './entities/route'
import JSBI from 'jsbi'
import  {getPoolInfoByToken, getListRoute, encodePath} from './poolinfo'

import {
  CurrentConfig,tokenSwap,
} from './config'

import {
  ERC20_ABI,
  TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS
} from './constants'

import {
  getProvider,
  getWalletAddress,
  sendTransaction,
  TransactionState,
} from './providers'
import { fromReadableAmount } from './utils1'
import QuoterV2ABI from "./QuoterV2.json";


/*
import { ethers } from 'ethers'
import { TradeType,Token,Currency,CurrencyAmount,Pool,Route,Trade,SwapQuoter,SwapOptions,SwapRouter,Percent } from 'trustless-swap-sdk'

import JSBI from 'jsbi'

import {
  ERC20_ABI,
  tokenSwap,
  CurrentConfig,
  TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS
} from '../config'
import {getPoolInfo, getPoolInfoByToken, getListRoute, encodePath} from './pool'
import {
  getProvider,
  getWalletAddress,
  sendTransaction,
  TransactionState,
} from './providers'
import { fromReadableAmount } from './utils'
import QuoterV2ABI from "./QuoterV2.json";
import IV3PoolABI from "./IV3Pool.json";
*/
let listToken:any[] = [
]

export function  gettokenIndex(listToken :any[],address:string) {
  let position = -1
  for(let index = 0; index<listToken.length; index++) {
    if(listToken[index].address.toLowerCase()==address.toLowerCase())
    {
      position = index
    }
  }
  return position
}


export type TokenTrade = Trade<Token, Token, TradeType>

// Trading Functions

export async function createTrade(): Promise<TokenTrade> {
  /*
  const poolInfo = await getPoolInfo()


  const pool = new Pool(
      tokenSwap.in,
      tokenSwap.out,
      tokenSwap.poolFee,
      poolInfo.sqrtPriceX96.toString(),
      poolInfo.liquidity.toString(),
      poolInfo.tick
  )
  */

  //const poolInfo = await getPoolInfo()


  const provider = getProvider()
  if (!provider) {
    throw new Error('No provider')
  }
  const quoteContract = new ethers.Contract(
      CurrentConfig.QUOTER_CONTRACT_ADDRESS,
      QuoterV2ABI.abi,
      provider
  )
  const swapRoutes =await  getListRoute(tokenSwap.in.address, tokenSwap.out.address)
  let  listPools:any[] =[]

  const promises = swapRoutes.map(async (route: any) => {
    const addresses = route.path_tokens.map((token: any) => token['address']);
    const fees = route.path_pairs.map((pair: any) => Number(pair.fee));
    const transaction = await quoteContract
        .connect(provider)
        .callStatic
        .quoteExactInput(
            encodePath(addresses, fees),
            ethers.utils.parseEther(tokenSwap.amountIn.toString())
        );

    return Number(transaction.amountOut.toString());
  });

  const res = await Promise.all(promises);
  const result = Math.max(...res);
  const indexBestRoute = res.indexOf(result);
  const bestRoute = swapRoutes[indexBestRoute];

  for (var pair of bestRoute.path_pairs) {

    const index0 = gettokenIndex(listToken,pair.token0)
    const token0 = new Token(
        1,
        listToken[index0].address,
        listToken[index0].decimal,
        listToken[index0].symbol,
        listToken[index0].symbol)
    const index1 = gettokenIndex(listToken,pair.token1)
    const token1 = new Token(
        1,
        listToken[index1].address,
        listToken[index1].decimal,
        listToken[index1].symbol,
        listToken[index1].symbol)
    const p =await  getPoolInfoByToken( token0, token1,parseInt(pair.fee))
    listPools.push(p)
  }

  const swapRout1 = new Route(
      listPools,
      tokenSwap.in,
      tokenSwap.out
  )


  const uncheckedTrade = Trade.createUncheckedTrade({
    route: swapRout1,
    inputAmount: CurrencyAmount.fromRawAmount(
        tokenSwap.in,
        fromReadableAmount(
            tokenSwap.amountIn,
            tokenSwap.in.decimals
        ).toString()
    ),
    outputAmount: CurrencyAmount.fromRawAmount(
        tokenSwap.out,
        JSBI.BigInt(result)
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
/*
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

 */

export function setTokens(listTk :any[]){
  listToken =[...listTk]
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
    return TransactionState.Failed
  }
}

