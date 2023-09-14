import IV3PoolABI from './IV3Pool.json'
import {computePoolAddress} from './utils/computePoolAddress'
import {Token} from './entities/token'
import {Pool} from './entities/pool'
import { ethers } from 'ethers'

import { CurrentConfig} from './config'
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



export async function getPoolInfo(tokenIn: Token,tokenOut:Token,poolFee:number ): Promise<PoolInfo> {
  const provider = getProvider()
  if (!provider) {
    throw new Error('No provider')
  }
  console.log("vao day 4")
  const currentPoolAddress = computePoolAddress({
    factoryAddress:CurrentConfig.POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: tokenIn,
    tokenB: tokenOut,
    fee: poolFee
  })
  console.log("vao day 7")
  console.log("param",{
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

  const [token0, token1, fee, tickSpacing, liquidity, slot0] =
    await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ])
  console.log("vao day 6")

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



