import IV3PoolABI from './IV3Pool.json'
import {computePoolAddress} from './utils/computePoolAddress'
import {Token} from './entities/token'
import {Pool} from './entities/pool'
import { ethers } from 'ethers'

import {tokenSwap, CurrentConfig, Environment} from './config'
import { getProvider } from './providers'
import { FeeAmount } from './constants'

interface PoolInfo {
  token0: string
  token1: string
  fee: number
  tickSpacing: number
  sqrtPriceX96: ethers.BigNumber
  liquidity: ethers.BigNumber
  tick: number
}
export async function getPoolInfoByToken(tokenIn: Token,tokenOut:Token,poolFee:number ): Promise<Pool> {
  const provider = getProvider()
  if (!provider) {
    throw new Error('No provider')
  }


  const currentPoolAddress = computePoolAddress({
    factoryAddress:CurrentConfig.POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: tokenIn,
    tokenB: tokenOut,
    fee: poolFee
  })

  const poolContract = new ethers.Contract(
      currentPoolAddress,
      IV3PoolABI.abi,
      provider
  )


  //const token0 = await poolContract.token0()
  //const token1 = await poolContract.token1()
  //const fee = await poolContract.fee()
  //const tickSpacing = await poolContract.tickSpacing()
  const liquidity = await poolContract.liquidity()
  const slot0 = await poolContract.slot0()

  const p = new Pool(
      tokenIn,
      tokenOut,
      poolFee,
      slot0[0].toString(),
      liquidity.toString(),
      slot0[1]
  )


  return p
}

let API_ROOT = ''
if (CurrentConfig.env == Environment.MAINNET)
{
  API_ROOT ="https://www.fprotocol.io"
}else  if (CurrentConfig.env == Environment.TESTNET)
{
  API_ROOT ="https://dev.fprotocol.io"
}

export async function getListRoute(from:string,to:string): Promise<any[]>{
  let listrs =[]
  try {
    const res = await fetch(
        API_ROOT+`/api/swap/token/route/v2?network=nos&from_token=`+from+'&to_token='+to,
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

export async function getPoolInfo(): Promise<PoolInfo> {
  const provider = getProvider()
  if (!provider) {
    throw new Error('No provider')
  }

  const currentPoolAddress = computePoolAddress({
    factoryAddress:CurrentConfig.POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: tokenSwap.in,
    tokenB: tokenSwap.out,
    fee: tokenSwap.poolFee
  })

  const poolContract = new ethers.Contract(
      currentPoolAddress,
      IV3PoolABI.abi,
      provider
  )

  const [token0, token1, fee, tickSpacing, liquidity, slot0] =
    await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ])

  return {
    token0,
    token1,
    fee,
    tickSpacing,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  }
}

const FEE_SIZE = 3

export function encodePath(path: string[], fees: FeeAmount[]): string {
  if (path.length != fees.length + 1) {
    throw new Error('path/fee lengths do not match')
  }

  let encoded = '0x'
  for (let i = 0; i < fees.length; i++) {
    // 20 byte encoding of the address
    encoded += path[i].slice(2)
    // 3 byte encoding of the fee
    encoded += fees[i].toString(16).padStart(2 * FEE_SIZE, '0')
  }
  // encode the final token
  encoded += path[path.length - 1].slice(2)

  return encoded.toLowerCase()
}

