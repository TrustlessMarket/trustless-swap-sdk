import {ethers} from 'ethers'
import {SwapOptions, SwapRouter} from './entities/swapRouter'
import {SwapOptionsNaka, SwapRouterNaka} from './entities/swapRouterNaka'
import {Percent} from './entities/fractions/percent'
import {ERC20_ABI, TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER, TradeType} from './constants'
import {Token} from './entities/token'
import {Trade} from './entities/trade'
import {CurrencyAmount} from './entities/fractions/currencyAmount'
import {Route} from './entities/route'
import JSBI from 'jsbi'
import {encodePath, getPoolInfoByToken} from './poolinfo'
//import queryString from 'query-string';
import {isEmpty, random} from 'lodash';
import camelCase from 'lodash/camelCase'
import {CurrentConfig, CurrentWallet, tokenSwap, WalletType} from './config'

import {
  geSignerAddress,
  getProvider,
  getWalletAddress,
  sendTransaction,
  sendTransactionGetReceipt,
  TransactionState
} from './providers'
import {getCurrencyApproveRouter} from './wallet'
import {fromReadableAmount} from './utils1'
import QuoterV2ABI from "./QuoterV2.json";
import QuoterV2ABINaka from "./QuoterV2Naka.json";
import axios from 'axios';
import {IToken} from './interfaces/token'


export interface IPagingParams {
  limit?: number;
  page?: number;
  is_test?: string;
  network?: string;
}
export interface IListTokenParams {
  is_test?: string;
  from_token?: string;
  network?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const camelCaseKeys = (obj: any): any => {
  if (Boolean(obj) && !isEmpty(obj) && Array.isArray(obj)) {
    return obj.map((v) => camelCaseKeys(v));
  }
  if (Boolean(obj) && obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
        (result, key) => ({
          ...result,
          [camelCase(key)]: camelCaseKeys(obj[key]),
        }),
        {},
    );
  }
  return obj;
};


export const swrFetcher = async (url: string, options: any) => {
  const { method, data, ...rest } = options;

  try {
    const response = await axios.request({ url, method, data, ...rest });

    return camelCaseKeys(response?.data?.data || response?.data?.result);
  } catch (error) {
    throw new Error( 'Something went wrong');
  }
};


export async function getListRoute(from:string,to:string): Promise<any[]>{
  let listrs =[]
  try {
    const res = await fetch(
        CurrentConfig.API_ROOT+`/api/swap/token/route/v2?network=${CurrentConfig.chainName}&from_token=`+from+'&to_token='+to,
    ).then((res:any) => {
      return res.json();
    });
    for(let index = 0; index<res.data.length; index++)
    {
      listrs.push(res.data[index])
    }
  } catch (error) {

  } finally {

  }
  return listrs
}

export const getSwapTokensV1 = async (
    params: any,
): Promise<IToken[]> => {
  const qs = '?' + new URLSearchParams(params).toString();

  return swrFetcher(`${CurrentConfig.API_ROOT}/api/swap/token/list/v1${qs}`, {
    method: 'GET',
    error: 'Fail to get tokens data',
  });
};

export interface ISwapRouteParams {
  from_token: string;
  to_token: string;
  network?: string
}

export const getSwapRoutesV2 = async (params: any) => {
  const qs = '?' + new URLSearchParams(params).toString();
  return swrFetcher(`${CurrentConfig.API_ROOT}/api/swap/token/route/v2${qs}`, {
    method: 'GET',
    error: 'Fail to get route',
  });
};


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
export const reCheckRouteInSlippage= async function(amountIn: any, route: any, slippage: number, maxSlippage: number, oldNumber: number): Promise<any[]> {
  const provider = getProvider()
  if (!provider) {
    throw new Error('No provider')
  }
  try {
    const addresses = route?.pathTokens?.map((token: IToken) => token.address);
    const fees = route?.pathPairs?.map((pair: any) => Number(pair.fee));
    try {

      const quoteContract = new ethers.Contract(
            CurrentConfig.QUOTER_CONTRACT_ADDRESS,
            QuoterV2ABI.abi,
            provider
        )
      const transaction = await quoteContract
          .connect(provider)
          .callStatic
          .quoteExactInput(
              encodePath(addresses, fees),
              ethers.utils.parseEther(amountIn.toString())
          );
     const out = Number(transaction.amountOut.toString());
     if(out<oldNumber*(1.0-slippage/10000))
     {
       if(out>=oldNumber*(1.0-maxSlippage/10000)) {
         let  listPools:any[] =[]
         for (var pair of route.pathPairs){
           const index0 = gettokenIndex(route.pathTokens,pair.token0)
           const token0 = new Token(
               1,
               route.pathTokens[index0].address,
               Number(route.pathTokens[index0].decimal),
               route.pathTokens[index0].symbol,
               route.pathTokens[index0].name)
           const index1 = gettokenIndex(route.pathTokens,pair.token1)
           const token1 = new Token(
               1,
               route.pathTokens[index1].address,
               Number(route.pathTokens[index1].decimal),
               route.pathTokens[index1].symbol,
               route.pathTokens[index1].name)
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
               JSBI.BigInt(out)
           ),
           tradeType: TradeType.EXACT_INPUT,
         })
         return [true,uncheckedTrade]
       }
       return [true]
     }else {
       return [false]
     }
    } catch (e) {
      console.log("reCheckRouteIn e",e)
      return [true]
    }
  } catch (error) {
    console.log("reCheckRouteIn all",error)
    return [true]
  } finally {
  }
}
export const reCheckRouteOutSlippage= async function(amountOut: any, route: any, slippage: number, maxSlippage: number, oldNumber: number): Promise<any[]> {
  const provider = getProvider()
  if (!provider) {
    throw new Error('No provider')
  }
  try {
    let addresses = route?.pathTokens?.map((token: IToken) => token.address);
    let fees = route?.pathPairs?.map((pair: any) => Number(pair.fee));
    addresses = addresses.reverse()
    fees = fees.reverse()
    try {
      const quoteContract = new ethers.Contract(
          CurrentConfig.QUOTER_CONTRACT_ADDRESS,
          QuoterV2ABI.abi,
          provider
      )
      const transaction = await quoteContract
          .connect(provider)
          .callStatic
          .quoteExactOutput(
              encodePath(addresses,fees),
              ethers.utils.parseEther(amountOut.toString())
          );
      const input = Number(transaction.amountIn.toString())
      if(input>oldNumber*1.0/(1.0-slippage/10000))
      {
        if(input<=oldNumber/(1.0-maxSlippage/10000)) {
          let  listPools:any[] =[]
          for (var pair of route.pathPairs){
            const index0 = gettokenIndex(route.pathTokens,pair.token0)
            const token0 = new Token(
                1,
                route.pathTokens[index0].address,
                Number(route.pathTokens[index0].decimal),
                route.pathTokens[index0].symbol,
                route.pathTokens[index0].name)
            const index1 = gettokenIndex(route.pathTokens,pair.token1)
            const token1 = new Token(
                1,
                route.pathTokens[index1].address,
                Number(route.pathTokens[index1].decimal),
                route.pathTokens[index1].symbol,
                route.pathTokens[index1].name)
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
                JSBI.BigInt(input),
            ),
            outputAmount: CurrencyAmount.fromRawAmount(
                tokenSwap.out,
                fromReadableAmount(
                    amountOut,
                    tokenSwap.in.decimals
                ).toString()
            ),
            tradeType: TradeType.EXACT_OUTPUT,
          })
          return [true,uncheckedTrade]
        }
        return [true]
      }else {
        return [false]
      }
    } catch (e) {
      console.log("reCheckRouteout e",e)
      return [true]
    }
  } catch (error) {
    console.log("reCheckRouteout all",error)
    return [true]
  } finally {
  }
}

// Trading Functions

export const getBestRouteExactIn= async function(amountIn: any, swapRoutes: any[] = [], listToken1: IToken[] = []): Promise<any[]> {
  try {
  const provider = getProvider()
  if (!provider) {
    throw new Error('No provider')
  }
    const quoteContract = new ethers.Contract(
         CurrentConfig.QUOTER_CONTRACT_ADDRESS,
         QuoterV2ABI.abi,
         provider
     )
  let  listPools:any[] =[]


  if( swapRoutes.length==0)
  {
    const params: ISwapRouteParams = {
      from_token: tokenSwap.in.address,
      to_token: tokenSwap.out.address,
      network: CurrentConfig.network
    };
    swapRoutes = await getSwapRoutesV2(params);
  }
  if( listToken1.length==0)
  {
    /*
    const res = await getSwapTokensV1({
      limit: 500,
      page: 1,
      is_test: CurrentConfig.env == Environment.TESTNET ? '1' : '',
      network:  CurrentConfig.chainName || "nos",
    });

    listToken1 = res ? camelCaseKeys(res) : [];
   */
  }

    let swapRoutes1 = []
    for (var route of swapRoutes) {
      if(route?.pathPairs.length>0 && (Number(route?.pathPairs[0].reserve0)>0.000001 || Number(route?.pathPairs[0].reserve1)>0.000001))
      {
        swapRoutes1.push(route)
      }
    }

    const promises = swapRoutes1.map(async (route: any) => {
    const addresses = route?.pathTokens?.map((token: IToken) => token.address);
    const fees = route?.pathPairs?.map((pair: any) => Number(pair.fee));
    try {
      const transaction = await quoteContract
          .connect(provider)
          .callStatic
          .quoteExactInput(
              encodePath(addresses, fees),
              ethers.utils.parseEther(amountIn.toString())
          );
      return Number(transaction.amountOut.toString());

    } catch (e) {
      console.log("quoteExactIn error route,addresses,fees, encodePath(addresses, fees),ethers.utils.parseEther(amountIn.toString()),e",route,addresses,fees, encodePath(addresses, fees),ethers.utils.parseEther(amountIn.toString()),e)
    }
    return 0
  });


  const res:number[] = await Promise.all(promises);
  console.log("res",res)
  const result = Math.max(...res);
    if(result==0){
      return [-1]
    }
  const indexBestRoute = res.indexOf(result);
  const bestRoute = swapRoutes1[indexBestRoute];
  for (var pair of bestRoute.pathPairs) {
    const index0 = gettokenIndex(bestRoute.pathTokens,pair.token0)
    const token0 = new Token(
        1,
        bestRoute.pathTokens[index0].address,
       Number(bestRoute.pathTokens[index0].decimal),
        bestRoute.pathTokens[index0].symbol,
        bestRoute.pathTokens[index0].name)
    const index1 = gettokenIndex(bestRoute.pathTokens,pair.token1)
    const token1 = new Token(
        1,
        bestRoute.pathTokens[index1].address,
        Number(bestRoute.pathTokens[index1].decimal),
        bestRoute.pathTokens[index1].symbol,
        bestRoute.pathTokens[index1].name)
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

  return [result,bestRoute,uncheckedTrade,result.toLocaleString('fullwide', {useGrouping:false}) ]
  } catch (error) {
    console.log("quoteExactInput Exception all",error)
  } finally {

  }
  return [-1]

}

export const getBestRouteExactOut= async function(amountOut: any, swapRoutes: any[] = [], listToken1: IToken[] = []): Promise<any[]> {
  try {

    const provider = getProvider()
    if (!provider) {
      throw new Error('No provider')
    }
    const quoteContract = new ethers.Contract(
          CurrentConfig.QUOTER_CONTRACT_ADDRESS,
          QuoterV2ABI.abi,
          provider
      )
    let  listPools:any[] =[]


    if( swapRoutes.length==0)
    {
      const params: ISwapRouteParams = {
        from_token: tokenSwap.in.address,
        to_token: tokenSwap.out.address,
        network: CurrentConfig.network
      };
      swapRoutes = await getSwapRoutesV2(params);
    }

    if(listToken1.length==0)
    {
      /*
      const res = await getSwapTokensV1({
        limit: 500,
        page: 1,
        is_test: CurrentConfig.env == Environment.TESTNET ? '1' : '',
        network:  CurrentConfig.chainName || "nos",
      });

      listToken1 = res ? camelCaseKeys(res) : [];
       */

    }
    let swapRoutes1 = []
    for (let route of swapRoutes) {
      if(route?.pathPairs.length>0 && (Number(route?.pathPairs[0].reserve0)>0.000001 || Number(route?.pathPairs[0].reserve1)>0.000001))
      {
        swapRoutes1.push(route)
      }
    }

    const promises = swapRoutes1.map(async (route: any) => {
      let addresses = route?.pathTokens?.map((token: IToken) => token.address);
      let fees = route?.pathPairs?.map((pair: any) => Number(pair.fee));
      addresses = addresses.reverse()
      fees = fees.reverse()
      try {
        const transaction = await quoteContract
            .connect(provider)
            .callStatic
            .quoteExactOutput(
                encodePath(addresses,fees),
                ethers.utils.parseEther(amountOut.toString())
            );

        return Number(transaction.amountIn.toString());

      } catch (e) {
        console.log("quoteExactOutput error route,addresses,fees, encodePath(addresses, fees),ethers.utils.parseEther(amountIn.toString()),e",route,addresses,fees, encodePath(addresses, fees),ethers.utils.parseEther(amountOut.toString()),e)
      }
      return 0
    });
    const res:number[] = await Promise.all(promises);
    let returnIndex = -1
    res.forEach(function (value, index,arr) {
      if(value>0&&returnIndex==-1){
        returnIndex =index
      }else if(value>0&&returnIndex>=0 &&value<arr[returnIndex])   {
        returnIndex =index
      }
    });
    if (returnIndex == -1){
      return [returnIndex]
    }
    console.log("res",res)
    const result = res[returnIndex];
    const indexBestRoute = returnIndex;
    const bestRoute = swapRoutes1[indexBestRoute];

    for (let pair of bestRoute.pathPairs) {

      const index0 = gettokenIndex(bestRoute.pathTokens,pair.token0)
      const token0 = new Token(
          1,
          bestRoute.pathTokens[index0].address,
          Number(bestRoute.pathTokens[index0].decimal),
          bestRoute.pathTokens[index0].symbol,
          bestRoute.pathTokens[index0].name)
      const index1 = gettokenIndex(bestRoute.pathTokens,pair.token1)
      const token1 = new Token(
          1,
          bestRoute.pathTokens[index1].address,
          Number(bestRoute.pathTokens[index1].decimal),
          bestRoute.pathTokens[index1].symbol,
          bestRoute.pathTokens[index1].name)
      const p =await  getPoolInfoByToken(token0,token1,parseInt(pair.fee))
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
          JSBI.BigInt(result),
      ),
      outputAmount: CurrencyAmount.fromRawAmount(
          tokenSwap.out,
          fromReadableAmount(
              amountOut,
              tokenSwap.in.decimals
          ).toString()
      ),
      tradeType: TradeType.EXACT_OUTPUT,
    })

    return [result,bestRoute,uncheckedTrade]

  } catch (error) {
    console.log("getBestRouteExactOut all",error)
  } finally {
  }
  return [-1]
}


export const getBestRouteExactInNaka= async function(amountIn: any,useDefiToken:any,
                                                     swapRoutes: any[] = []): Promise<any[]> {
  try {
    const provider = getProvider()
    if (!provider) {
      throw new Error('No provider')
    }
    const quoteContract = new ethers.Contract(
        CurrentConfig.QUOTER_CONTRACT_ADDRESS,
        QuoterV2ABINaka.abi,
        provider
    )
    let  listPools:any[] =[]
    if( swapRoutes.length==0)
    {
      const params: ISwapRouteParams = {
        from_token: tokenSwap.in.address,
        to_token: tokenSwap.out.address,
        network: CurrentConfig.network
      };
      swapRoutes = await getSwapRoutesV2(params);
    }



    let swapRoutes1 = []
    for (var route of swapRoutes) {
     // console.log("route swapRoutes",route)
      if(route?.pathPairs.length>0 && (Number(route?.pathPairs[0].reserve0)>0.000001 || Number(route?.pathPairs[0].reserve1)>0.000001))
      {
        swapRoutes1.push(route)
      }
    }

    const promises = swapRoutes1.map(async (route: any) => {
      const addresses = route?.pathTokens?.map((token: IToken) => token.address);
      const fees = route?.pathPairs?.map((pair: any) => Number(pair.fee));
      try {
        const transaction = await quoteContract
            .connect(provider)
            .callStatic
            .quoteExactInput(
                encodePath(addresses, fees),
                ethers.utils.parseEther(amountIn.toString()),
                useDefiToken
            );
        return [Number(transaction.amountOut.toString()),Number(transaction.amountDefi.toString())];

      } catch (e) {
        console.log("quoteExactIn error route,addresses,fees, encodePath(addresses, fees),ethers.utils.parseEther(amountIn.toString()),e",route,addresses,fees, encodePath(addresses, fees),ethers.utils.parseEther(amountIn.toString()),e)
      }
      return [0,0]
    });


    const res = await Promise.all(promises);
   // console.log("result res",res)
    //const result = Math.max(...res[0]);
    let  result = 0
    let indexBestRoute = -1;
    for (let idx = 0;idx<res.length;idx++){
      if(res[idx][0]> result){
        indexBestRoute = idx;
        result = res[idx][0]
      }
    }
    if(result==0){
      return [-1]
    }
    const bestRoute = swapRoutes1[indexBestRoute];
    for (var pair of bestRoute.pathPairs) {
      const index0 = gettokenIndex(bestRoute.pathTokens,pair.token0)
      const token0 = new Token(
          1,
          bestRoute.pathTokens[index0].address,
          Number(bestRoute.pathTokens[index0].decimal),
          bestRoute.pathTokens[index0].symbol,
          bestRoute.pathTokens[index0].name)
      const index1 = gettokenIndex(bestRoute.pathTokens,pair.token1)
      const token1 = new Token(
          1,
          bestRoute.pathTokens[index1].address,
          Number(bestRoute.pathTokens[index1].decimal),
          bestRoute.pathTokens[index1].symbol,
          bestRoute.pathTokens[index1].name)
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
   // console.log("result,bestRoute,uncheckedTrade,res[indexBestRoute][1] ]",result,bestRoute,uncheckedTrade,res[indexBestRoute][1])

    return [result,bestRoute,uncheckedTrade,res[indexBestRoute][1] ]
  } catch (error) {
    console.log("quoteExactInput Exception all",error)
  } finally {

  }
  return [-1]

}

export const getBestRouteExactOutNaka= async function(amountOut: any,useDefiToken:any, swapRoutes: any[] = []): Promise<any[]> {
  try {

    const provider = getProvider()
    if (!provider) {
      throw new Error('No provider')
    }
    const quoteContract = new ethers.Contract(
        CurrentConfig.QUOTER_CONTRACT_ADDRESS,
        QuoterV2ABINaka.abi,
        provider
    )
    let  listPools:any[] =[]


    if( swapRoutes.length==0)
    {
      const params: ISwapRouteParams = {
        from_token: tokenSwap.in.address,
        to_token: tokenSwap.out.address,
        network: CurrentConfig.network
      };
      swapRoutes = await getSwapRoutesV2(params);
    }

    let swapRoutes1 = []
    for (let route of swapRoutes) {
      if(route?.pathPairs.length>0 && (Number(route?.pathPairs[0].reserve0)>0.000001 || Number(route?.pathPairs[0].reserve1)>0.000001))
      {
        swapRoutes1.push(route)
      }
    }

    const promises = swapRoutes1.map(async (route: any) => {
      let addresses = route?.pathTokens?.map((token: IToken) => token.address);
      let fees = route?.pathPairs?.map((pair: any) => Number(pair.fee));
      addresses = addresses.reverse()
      fees = fees.reverse()
      try {
       // console.log("addresses,fees,amountOut,useDefiToken",addresses,fees,amountOut,useDefiToken)
        const transaction = await quoteContract
            .connect(provider)
            .callStatic
            .quoteExactOutput(
                encodePath(addresses,fees),
                ethers.utils.parseEther(amountOut.toString()),
                useDefiToken
            );

        return [Number(transaction.amountIn.toString()),Number(transaction.amountDefi.toString())];

      } catch (e) {
        console.log("quoteExactOutput error route,addresses,fees, encodePath(addresses, fees),ethers.utils.parseEther(amountIn.toString()),e",route,addresses,fees, encodePath(addresses, fees),ethers.utils.parseEther(amountOut.toString()),e)
      }
      return [0,0]
    });
    const res = await Promise.all(promises);
    let returnIndex = -1
    res.forEach(function (value, index,arr) {
      if(value[0]>0&&returnIndex==-1){
        returnIndex =index
      }else if(value[0]>0&&returnIndex>=0 &&value[0]<arr[returnIndex][0])   {
        returnIndex =index
      }
    });
    if (returnIndex == -1){
      return [returnIndex]
    }
    const result = res[returnIndex];
    const indexBestRoute = returnIndex;
    const bestRoute = swapRoutes1[indexBestRoute];

    for (let pair of bestRoute.pathPairs) {

      const index0 = gettokenIndex(bestRoute.pathTokens,pair.token0)
      const token0 = new Token(
          1,
          bestRoute.pathTokens[index0].address,
          Number(bestRoute.pathTokens[index0].decimal),
          bestRoute.pathTokens[index0].symbol,
          bestRoute.pathTokens[index0].name)
      const index1 = gettokenIndex(bestRoute.pathTokens,pair.token1)
      const token1 = new Token(
          1,
          bestRoute.pathTokens[index1].address,
          Number(bestRoute.pathTokens[index1].decimal),
          bestRoute.pathTokens[index1].symbol,
          bestRoute.pathTokens[index1].name)
      const p =await  getPoolInfoByToken(token0,token1,parseInt(pair.fee))
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
          JSBI.BigInt(result[0]),
      ),
      outputAmount: CurrencyAmount.fromRawAmount(
          tokenSwap.out,
          fromReadableAmount(
              amountOut,
              tokenSwap.in.decimals
          ).toString()
      ),
      tradeType: TradeType.EXACT_OUTPUT,
    })

    return [result[0],bestRoute,uncheckedTrade,result[1]]

  } catch (error) {
    console.log("getBestRouteExactOut all",error)
  } finally {
  }
  return [-1]
}

export async function executeTradeSlippageNaka(
    trade: TokenTrade,
    slippage: number,
    useDefiToken: boolean,
    recipient:any = null,
    scanTX:any = true,
): Promise<any> {

  let walletAddress = getWalletAddress()
  if (!walletAddress && CurrentWallet.type === WalletType.EXTENSION){
    walletAddress =  await geSignerAddress()
  }
  if (!walletAddress ) {
    throw new Error('Cannot execute a trade without a connected wallet')
  }

  recipient =recipient!=null&&recipient!=""?recipient:walletAddress

  const options: SwapOptionsNaka = {
    slippageTolerance: new Percent(slippage, 10_000), // 50 bips, or 0.50%
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    recipient: recipient,
    useDefiToken:useDefiToken,
  }
  const methodParameters = SwapRouterNaka.swapCallParameters([trade], options)
  const tx = {
    data: methodParameters.calldata,
    to: CurrentConfig.SWAP_ROUTER_ADDRESS,
    value: methodParameters.value,
    from: walletAddress,
    //maxFeePerGas: MAX_FEE_PER_GAS.toString(),
    // maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS.toString(),
    //  gasPrice: getGasFee(),
    // gasLimit: '1000000',
  }
  const res = await sendTransactionGetReceipt(tx,scanTX)

  return res
}

export async function createTrade(): Promise<TokenTrade> {
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

export async function executeTradeAftercheckSlippage(
    type:TradeType,
    oldAmout: any,
    expectAmout: any,
    bestRoute: any,
    trade: TokenTrade,
    slippage: number,
    maxSlippage: number,
    recipient:any = null,
    scanTX:any = true,
): Promise<any> {
  let newEstimate = undefined;
  let newTrade = trade;
  if(type == TradeType.EXACT_OUTPUT)
  {
    newEstimate = await reCheckRouteOutSlippage(expectAmout, bestRoute, slippage, maxSlippage, oldAmout)
  }else {
    newEstimate = await reCheckRouteInSlippage(expectAmout, bestRoute, slippage, maxSlippage, oldAmout)
  }
  if(newEstimate===[true]){
    return [false]
  }else if(newEstimate[0]==true && newEstimate.length==2){
    newTrade = newEstimate[1]
  }

  let walletAddress = getWalletAddress()
  if (!walletAddress && CurrentWallet.type === WalletType.EXTENSION){
    walletAddress =  await geSignerAddress()
  }
  if (!walletAddress ) {
    throw new Error('Cannot execute a trade without a connected wallet')
  }

  recipient =recipient!=null&&recipient!=""?recipient:walletAddress

  const options: SwapOptions = {
    slippageTolerance: new Percent(slippage, 10_000), // 50 bips, or 0.50%
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    recipient: recipient,
  }
  const methodParameters = SwapRouter.swapCallParameters([newTrade], options)
  const tx = {
    data: methodParameters.calldata,
    to: CurrentConfig.SWAP_ROUTER_ADDRESS,
    value: methodParameters.value,
    from: walletAddress,
  }

  const res = await sendTransactionGetReceipt(tx,scanTX)
  return  [true,res]
}

export async function executeTradeSlippage(
    trade: TokenTrade,
    slippage: number,
    recipient:any = null,
    scanTX:any = true,
): Promise<any> {

  let walletAddress = getWalletAddress()
  if (!walletAddress && CurrentWallet.type === WalletType.EXTENSION){
    walletAddress =  await geSignerAddress()
  }
  if (!walletAddress ) {
    throw new Error('Cannot execute a trade without a connected wallet')
  }

  recipient =recipient!=null&&recipient!=""?recipient:walletAddress

  const options: SwapOptions = {
    slippageTolerance: new Percent(slippage, 10_000), // 50 bips, or 0.50%
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    recipient: recipient,
  }
  const methodParameters = SwapRouter.swapCallParameters([trade], options)
  const tx = {
    data: methodParameters.calldata,
    to: CurrentConfig.SWAP_ROUTER_ADDRESS,
    value: methodParameters.value,
    from: walletAddress,
    //maxFeePerGas: MAX_FEE_PER_GAS.toString(),
   // maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS.toString(),
  //  gasPrice: getGasFee(),
   // gasLimit: '1000000',
  }

  const res = await sendTransactionGetReceipt(tx,scanTX)

  return res

}

export async function executeTrade(
    trade: TokenTrade
): Promise<TransactionState> {
  const walletAddress = getWalletAddress()
  const provider = getProvider()

  if (!walletAddress || !provider) {
    throw new Error('Cannot execute a trade without a connected wallet')
  }

/*

// Give approval to the router to spend the token
  const tokenApproval = await getTokenTransferApproval(tokenSwap.in,Number(trade.inputAmount.toExact()))

// Fail if transfer approvals do not go through
  if (tokenApproval !== TransactionState.Sent) {
    return TransactionState.Failed
  }
 */



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
   // maxFeePerGas: MAX_FEE_PER_GAS,
   // maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
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

export async function getTokenTransferApprovalSwap(
    token: Token

): Promise<number> {
  const provider = getProvider()
  const walletAddress = getWalletAddress()
  if (!provider || !walletAddress) {
    console.log('No Provider Found')
    return -1
  }

  return  await  getCurrencyApproveRouter(provider, walletAddress, token)
}

export async function tokenTransferApproval(
    token: Token,
    amount:number = TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,

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
            amount,
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

export const getGasFee = async (): Promise<number> => {
  const _rpc = CurrentConfig.rpc;

  if (_rpc) {
    const provider = new ethers.providers.JsonRpcProvider(_rpc);
    const gasPrice = await provider.getGasPrice();

    return Number(gasPrice?.toString());
  }

  return 0;
};

export const DEFAULT_GAS_PRICE = 1e9;
export const getDefaultGasPrice = () => {
  return random(35, 45) * DEFAULT_GAS_PRICE;
};

