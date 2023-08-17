import { ethers } from 'ethers'
import { CurrentConfig } from '../config'
import IV3PoolABI from './IV3Pool.json'
import { POOL_FACTORY_CONTRACT_ADDRESS } from '../libs/constants'
import { getProvider } from '../libs/providers'
import { computePoolAddress } from 'trustless-swap-sdk'

interface PoolInfo {
  token0: string
  token1: string
  fee: number
  tickSpacing: number
  sqrtPriceX96: ethers.BigNumber
  liquidity: ethers.BigNumber
  tick: number
}

export async function getPoolInfo(): Promise<PoolInfo> {
  const provider = getProvider()
  if (!provider) {
    throw new Error('No provider')
  }

  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: CurrentConfig.tokens.token0,
    tokenB: CurrentConfig.tokens.token1,
    fee: CurrentConfig.tokens.poolFee,
    initCodeHashManualOverride:"0x04759a882be3a45ff74719de5c82516d29af4b3480d076fc0c57b2fdab813bc7",
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
