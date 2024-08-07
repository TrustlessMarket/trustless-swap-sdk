import { BigNumber, ethers } from 'ethers'
import {
  ERC20_ABI,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
  NONFUNGIBLE_POSITION_MANAGER_ABI,
} from './constants'
import { TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,MaxUint128 } from './constants'
import {geSignerAddress, sendTransaction, sendTransactionGetReceipt, TransactionState} from './providers'

import { Pool } from './entities/pool'
import { Position } from './entities/position'
import { nearestUsableTick } from './utils/nearestUsableTick'
import { Token } from './entities/token'
import { Percent } from './entities/fractions/percent'
import { CurrencyAmount } from './entities/fractions/currencyAmount'
import { NonfungiblePositionManager,MintOptions,AddLiquidityOptions,RemoveLiquidityOptions,CollectOptions } from './nonfungiblePositionManager'
import {CurrentConfig, CurrentWallet, tokenLiquidity, WalletType} from './config'
import { getPoolInfo} from './poolinfo'
import { getProvider, getWalletAddress } from './providers'
import { fromReadableAmount } from './conversion'
import {camelCaseKeys} from "./trading";
import  {ILiquidity} from './interfaces/liquidity'
import  {IToken} from './interfaces/token'
import  {IPosition} from './interfaces/position'
import axios from 'axios';
import INonfungiblePositionManager from './Nonfungible.json'
import IV3PoolABI from "./IV3Pool.json";
import IV3FactoryABI from "./V3Factory.json";

 const swrFetcher = async (url: string, options: any) => {
  const { method, data, ...rest } = options;

  try {
    const response = await axios.request({ url, method, data, ...rest });

    return camelCaseKeys(response?.data?.data || response?.data?.result);
  } catch (error) {
    throw new Error( 'Something went wrong');
  }
};


export const getListLiquidity = async (
    address?: string
): Promise<ILiquidity[]> => {
  const qs = `?limit=100&network=${CurrentConfig.chainName}&page=1&address=${address}`
  return swrFetcher(`${CurrentConfig.API_ROOT}/api/swap/pair/apr/list${qs}`, {
    method: 'GET',
    error: 'Fail to get list liquidity',
  });
};

//TODO:  add type
export const getTokens = async (limit:any): Promise<IToken[]> => {
  return swrFetcher(`${CurrentConfig.API_ROOT}/api/token-explorer/tokens?limit=${limit.toString()}&network=${CurrentConfig.network}&page=1`, {
    method: 'GET',
    error: 'Fail to get tokens data',
  });
};

export const getPositionDetail = async (
    id: number
): Promise<IPosition> => {
  return swrFetcher(`${CurrentConfig.API_ROOT}/api/${CurrentConfig.swapApi}/pool/user-position/${id}?network=${CurrentConfig.network}`, {
    method: 'GET',
    error: 'Fail to get list user positions',
  });
};


export interface PositionInfo {
  tickLower: number
  tickUpper: number
  liquidity: BigNumber
  feeGrowthInside0LastX128: BigNumber
  feeGrowthInside1LastX128: BigNumber
  tokensOwed0: BigNumber
  tokensOwed1: BigNumber
}


export async function CollectFeeeById(
    tokenId:any
):Promise<TransactionState> {

  let walletAddress = getWalletAddress()
  if (!walletAddress && CurrentWallet.type === WalletType.EXTENSION){
    walletAddress =  await geSignerAddress()
  }
  if (!walletAddress ) {
    return TransactionState.Failed
  }

  // get calldata for increasing a position
  const { calldata, value } = NonfungiblePositionManager.encodeCollectById(
      tokenId,walletAddress
  )
  // build transaction
  const transaction = {
    data: calldata,
    to: CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    value: value,
    from: walletAddress
  }
  return await sendTransactionGetReceipt(transaction)
}

export async function increaseLiquidity(
    tokenId:any,
    amount0Desired:any, amount1Desired:any, amount0Min:any, amount1Min:any,deadline:any
):Promise<TransactionState> {

  let walletAddress = getWalletAddress()
  if (!walletAddress && CurrentWallet.type === WalletType.EXTENSION){
    walletAddress =  await geSignerAddress()
  }
  if (!walletAddress ) {
    return TransactionState.Failed
  }

  // get calldata for increasing a position
  const { calldata, value } = NonfungiblePositionManager.encodeIncrease(
      tokenId,amount0Desired,amount1Desired,amount0Min, amount1Min,deadline
  )
  // build transaction
  const transaction = {
    data: calldata,
    to: CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    value: value,
    from: walletAddress
  }
  return await sendTransactionGetReceipt(transaction)
}

export async function decreaseLiquidity(
    tokenId:any,liquidity:any, amount0Min:any, amount1Min:any,deadline:any
):Promise<TransactionState> {

  let walletAddress = getWalletAddress()
  if (!walletAddress && CurrentWallet.type === WalletType.EXTENSION){
    walletAddress =  await geSignerAddress()
  }
  if (!walletAddress ) {
    return TransactionState.Failed
  }

  // get calldata for increasing a position
  const { calldata, value } = NonfungiblePositionManager.encodeRemoveLiqidity(
      tokenId,liquidity,amount0Min, amount1Min,deadline, walletAddress
  )
  // build transaction
  const transaction = {
    data: calldata,
    to: CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    value: value,
    from: walletAddress
  }
  return await sendTransactionGetReceipt(transaction)
}

export async function removePosition(
    tokenId:any
):Promise<TransactionState> {

  let walletAddress = getWalletAddress()
  if (!walletAddress && CurrentWallet.type === WalletType.EXTENSION){
    walletAddress =  await geSignerAddress()
  }
  if (!walletAddress ) {
    return TransactionState.Failed
  }

  // get calldata for increasing a position
  const { calldata, value } = NonfungiblePositionManager.encodeRemovePosition(
      tokenId
  )
  // build transaction
  const transaction = {
    data: calldata,
    to: CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    value: value,
    from: walletAddress
  }
  return await sendTransactionGetReceipt(transaction)
}

export async function addLiquidityIncludeCreatePool(
    isNewPool:Boolean,
    fee:any,
    token0:any,
    token1:any,
    amountADesired:any,
    amountBDesired:any,
    lowerTick:any,
    upperTick:any,
    amount0Min:any,
    amount1Min:any,
    currentPrice:any,
    deadline:any,
):Promise<TransactionState> {


  let walletAddress = getWalletAddress()
  if (!walletAddress && CurrentWallet.type === WalletType.EXTENSION){
    walletAddress =  await geSignerAddress()
  }
  if (!walletAddress ) {
    return TransactionState.Failed
  }

  // get calldata for increasing a position
  const { calldata, value } = NonfungiblePositionManager.addCallParametersCreate(
      isNewPool,
      fee,
      token0,
      token1,
      amountADesired,
      amountBDesired,
      lowerTick,
      upperTick,
      amount0Min,
      amount1Min,
      currentPrice,
      walletAddress,
      deadline,
  )


  // build transaction
  const transaction = {
    data: calldata,
    to: CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    value: value,
    from: walletAddress
  }
  return await sendTransactionGetReceipt(transaction)

}

export async function addLiquidity(
  positionId: number
): Promise<TransactionState> {
  const address = getWalletAddress()
  const provider = getProvider()
  if (!address || !provider) {
    return TransactionState.Failed
  }

  const positionToIncreaseBy = await constructPosition(
    CurrencyAmount.fromRawAmount(
      tokenLiquidity.token0,
      fromReadableAmount(
        tokenLiquidity.token0Amount * tokenLiquidity.fractionToAdd,
        tokenLiquidity.token0.decimals
      )
    ),
    CurrencyAmount.fromRawAmount(
      tokenLiquidity.token1,
      fromReadableAmount(
        tokenLiquidity.token1Amount * tokenLiquidity.fractionToAdd,
        tokenLiquidity.token1.decimals
      )
    )
  )

  const addLiquidityOptions: AddLiquidityOptions = {
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    slippageTolerance: new Percent(50, 10_000),
    tokenId: positionId,
  }

  // get calldata for increasing a position
  const { calldata, value } = NonfungiblePositionManager.addCallParameters(
    positionToIncreaseBy,
    addLiquidityOptions
  )

  // build transaction
  const transaction = {
    data: calldata,
    to: CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    value: value,
    from: address,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  }

  return sendTransaction(transaction)
}

export async function removeLiquidity(
  positionId: number
): Promise<TransactionState> {
  const address = getWalletAddress()
  const provider = getProvider()
  if (!address || !provider) {
    return TransactionState.Failed
  }

  const currentPosition = await constructPosition(
    CurrencyAmount.fromRawAmount(
        tokenLiquidity.token0,
      fromReadableAmount(
          tokenLiquidity.token0Amount,
          tokenLiquidity.token0.decimals
      )
    ),
    CurrencyAmount.fromRawAmount(
        tokenLiquidity.token1,
      fromReadableAmount(
          tokenLiquidity.token1Amount,
          tokenLiquidity.token1.decimals
      )
    )
  )

  const collectOptions: Omit<CollectOptions, 'tokenId'> = {
    expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(
      tokenLiquidity.token0,
      0
    ),
    expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(
      tokenLiquidity.token1,
      0
    ),
    recipient: address,
  }

  const removeLiquidityOptions: RemoveLiquidityOptions = {
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    slippageTolerance: new Percent(50, 10_000),
    tokenId: positionId,
    // percentage of liquidity to remove
    liquidityPercentage: new Percent(tokenLiquidity.fractionToRemove),
    collectOptions,
  }
  // get calldata for minting a position
  const { calldata, value } = NonfungiblePositionManager.removeCallParameters(
    currentPosition,
    removeLiquidityOptions
  )

  // build transaction
  const transaction = {
    data: calldata,
    to: CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    value: value,
    from: address,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  }

  return sendTransaction(transaction)
}

export async function getPositionIds(): Promise<number[]> {
  const provider = getProvider()
  const address = getWalletAddress()

  if (!provider || !address) {
    throw new Error('No provider available')
  }

  const positionContract = new ethers.Contract(
      CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    NONFUNGIBLE_POSITION_MANAGER_ABI,
    provider
  )
  // Get number of positions
  const balance: number = await positionContract.balanceOf(address)


  // Get all positions
  const tokenIds = []
  for (let i = 0; i < balance; i++) {
    const tokenOfOwnerByIndex: number =
      await positionContract.tokenOfOwnerByIndex(address, i)
    tokenIds.push(tokenOfOwnerByIndex)
  }

  return tokenIds
}

export async function getPositionInfo(tokenId: number): Promise<PositionInfo> {
  const provider = getProvider()
  if (!provider) {
    throw new Error('No provider available')
  }

  const positionContract = new ethers.Contract(
      CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    NONFUNGIBLE_POSITION_MANAGER_ABI,
    provider
  )

  const position = await positionContract.positions(tokenId)

  return {
    tickLower: position.tickLower,
    tickUpper: position.tickUpper,
    liquidity: position.liquidity,
    feeGrowthInside0LastX128: position.feeGrowthInside0LastX128,
    feeGrowthInside1LastX128: position.feeGrowthInside1LastX128,
    tokensOwed0: position.tokensOwed0,
    tokensOwed1: position.tokensOwed1,
  }
}

export async function getTokenTransferApprovalPosition(
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
        CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
      TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER
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

export async function constructPosition(
  token0Amount: CurrencyAmount<Token>,
  token1Amount: CurrencyAmount<Token>
): Promise<Position> {
  // get pool info
  const poolInfo = await getPoolInfo(tokenLiquidity.token0,tokenLiquidity.token1,tokenLiquidity.poolFee)

  // construct pool instance
  const configuredPool = new Pool(
    token0Amount.currency,
    token1Amount.currency,
    poolInfo.fee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick
  )


  // create position using the maximum liquidity from input amounts
  return Position.fromAmounts({
    pool: configuredPool,
    tickLower:
      nearestUsableTick(poolInfo.tick, poolInfo.tickSpacing) -
      poolInfo.tickSpacing * 2,
    tickUpper:
      nearestUsableTick(poolInfo.tick, poolInfo.tickSpacing) +
      poolInfo.tickSpacing * 2,
    amount0: token0Amount.quotient,
    amount1: token1Amount.quotient,
    useFullPrecision: true,
  })
}

export async function mintPosition(): Promise<TransactionState> {
  const address = getWalletAddress()
  const provider = getProvider()
  if (!address || !provider) {
    return TransactionState.Failed
  }

  /*
  // Give approval to the contract to transfer tokens
  const tokenInApproval = await getTokenTransferApprovalPosition(
    tokenLiquidity.token0
  )
  const tokenOutApproval = await getTokenTransferApprovalPosition(
    tokenLiquidity.token1
  )

  if (
    tokenInApproval !== TransactionState.Sent ||
    tokenOutApproval !== TransactionState.Sent
  ) {
    return TransactionState.Failed
  }
*/

  const positionToMint = await constructPosition(
    CurrencyAmount.fromRawAmount(
      tokenLiquidity.token0,
      fromReadableAmount(
        tokenLiquidity.token0Amount,
        tokenLiquidity.token0.decimals
      )
    ),
    CurrencyAmount.fromRawAmount(
      tokenLiquidity.token1,
      fromReadableAmount(
        tokenLiquidity.token1Amount,
        tokenLiquidity.token1.decimals
      )
    )
  )


  const mintOptions: MintOptions = {
    recipient: address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    slippageTolerance: new Percent(50, 10_000),
  }

  // get calldata for minting a position
  const { calldata, value } = NonfungiblePositionManager.addCallParameters(
    positionToMint,
    mintOptions
  )

  // build transaction
  const transaction = {
    data: calldata,
    to:  CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    value: value,
    from: address,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  }

  return sendTransaction(transaction)
}

export async function getEarnedFee(tokenId:any): Promise<any> {
  let walletAddress = getWalletAddress()
  if (!walletAddress && CurrentWallet.type === WalletType.EXTENSION) {
    walletAddress = await geSignerAddress()
  }
  const provider = getProvider()
  if (!provider || !walletAddress) {
    throw new Error('No provider or address')
  }
  const quoteContract = new ethers.Contract(
      CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
      INonfungiblePositionManager,
      provider
  )

  const transaction = await quoteContract
      .connect(provider)
      .callStatic
      .collect({
            tokenId:tokenId,
            recipient: walletAddress,
            amount0Max: MaxUint128,
            amount1Max: MaxUint128,
          }
      );

  return [
    transaction.amount0.toString(),
    transaction.amount1.toString(),
  ]
}

export async function getPoolAddress(token0:any,token1:any,fee:any): Promise<any> {
  let walletAddress = getWalletAddress()
  if (!walletAddress && CurrentWallet.type === WalletType.EXTENSION) {
    walletAddress = await geSignerAddress()
  }
  const provider = getProvider()
  if (!provider || !walletAddress) {
    throw new Error('No provider or address')
  }
  const factoryContract = new ethers.Contract(
      CurrentConfig.POOL_FACTORY_CONTRACT_ADDRESS,
      IV3FactoryABI,
      provider
  )

  const transaction = await factoryContract
      .connect(provider)
      .callStatic
      .getPool(token0,token1,fee);

  return transaction
}

export async function getPoolFromAddress(poolAddress:any): Promise<any> {
  let walletAddress = getWalletAddress()
  if (!walletAddress && CurrentWallet.type === WalletType.EXTENSION) {
    walletAddress = await geSignerAddress()
  }
  const provider = getProvider()
  if (!provider || !walletAddress) {
    throw new Error('No provider or address')
  }
  const poolContract = new ethers.Contract(
      poolAddress,
      IV3PoolABI.abi,
      provider
  )

  const contract = await poolContract
      .connect(provider);

  return contract
}

export async function getPositionImage(tokenId:any): Promise<any> {
  let walletAddress = getWalletAddress()
  if (!walletAddress && CurrentWallet.type === WalletType.EXTENSION) {
    walletAddress = await geSignerAddress()
  }
  const provider = getProvider()
  if (!provider || !walletAddress) {
    throw new Error('No provider or address')
  }
  const quoteContract = new ethers.Contract(
      CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
      INonfungiblePositionManager,
      provider
  )

  const transaction = await quoteContract
      .connect(provider)
      .callStatic
      .tokenURI(tokenId);

  return transaction
}


