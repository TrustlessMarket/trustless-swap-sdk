import { WalletType,setTOkenSwap,setTOkenIn,setTOkenOut,changeWallet,tokenSwap,CurrentWallet,
    connectBrowserExtensionWallet,
    getProvider,
    getWalletAddress,
    TransactionState,choiceConFig,
    refreshProvider, createTrade, executeTrade, TokenTrade,setTokens,gettokenIndex,
    displayTrade,getCurrencyBalance
} from 'trustless-swap-sdk'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import './Example.css'
import { Environment, CurrentConfig,tokenLiquidity } from 'trustless-swap-sdk'
import {
  getPositionIds,
  mintPosition,
  addLiquidity,
  removeLiquidity,
  getPositionInfo,
  PositionInfo,
} from 'trustless-swap-sdk'

{

    // choiceConFig(Environment.MAINNET)
    // refreshProvider()
   // changeWallet(WalletType.PRIVATEKEY,"0x3B6c50437765f996A609eA479766141BB7903761","c46e21b81b8b70e0fdcbd537a9dd52fccd86a116ea2e998b2163ba51cd3c9bc4")
    choiceConFig(Environment.MAINNET)
    changeWallet(WalletType.EXTENSION,"","")
    refreshProvider(null)
   // setTOkenSwap(CurrentConfig.tokens_list[0],1,CurrentConfig.tokens_list[2],10000)
}

const useOnBlockUpdated = (callback: (blockNumber: number) => void) => {
  useEffect(() => {
    const subscription = getProvider()?.on('block', callback)
    return () => {
      subscription?.removeAllListeners()
    }
  })
}

const Example = () => {
  const [token0Balance, setToken0Balance] = useState<string>()
  const [token1Balance, setToken1Balance] = useState<string>()
  const [positionIds, setPositionIds] = useState<number[]>([])
  const [positionsInfo, setPositionsInfo] = useState<PositionInfo[]>([])
  const [txState, setTxState] = useState<TransactionState>(TransactionState.New)
  const [blockNumber, setBlockNumber] = useState<number>(0)

  // Listen for new blocks and update the wallet
  useOnBlockUpdated(async (blockNumber: number) => {
    refreshBalances()
    setBlockNumber(blockNumber)
  })

  // Update wallet state given a block number
  const refreshBalances = useCallback(async () => {
    const provider = getProvider()
    const address = getWalletAddress()
    if (!provider || !address) {
      return
    }
      console.log("vao day")
    // Set Balances

      setToken0Balance(
      await getCurrencyBalance(provider, address, tokenLiquidity.token0)
    )
    setToken1Balance(
      await getCurrencyBalance(provider, address, tokenLiquidity.token1)
    )
       // Set Position Info
       const ids = await getPositionIds()
       setPositionIds(ids)
       setPositionsInfo(await Promise.all(ids.map(getPositionInfo)))


  }, [])

  // Event Handlers

  const onConnectWallet = useCallback(async () => {
    if (await connectBrowserExtensionWallet()) {
      refreshBalances()
    }
  }, [refreshBalances])

  const onMintPosition = useCallback(async () => {
    setTxState(TransactionState.Sending)
    setTxState(await mintPosition())
  }, [])

  const onAddLiquidity = useCallback(async (position: number) => {
    setTxState(TransactionState.Sending)
    setTxState(await addLiquidity(position))
  }, [])

  const onRemoveLiquidity = useCallback(async (position: number) => {
    setTxState(TransactionState.Sending)
    setTxState(await removeLiquidity(position))
  }, [])

  // Formatted Data

  const positionInfoStrings: string[] = useMemo(() => {
    if (positionIds.length !== positionsInfo.length) {
      return []
    }

    return positionIds
      .map((id, index) => [id, positionsInfo[index]])
      .map((info) => {
        const id = info[0]
        const posInfo = info[1] as PositionInfo
        return `${id}: ${posInfo.liquidity.toString()} liquidity, owed ${posInfo.tokensOwed0.toString()} and ${posInfo.tokensOwed1.toString()}`
      })
  }, [positionIds, positionsInfo])

  return (
    <div className="App">
      {CurrentConfig.rpc === '' && (
        <h2 className="error">Please set your mainnet RPC URL in config.ts</h2>
      )}
      {CurrentWallet.type  === WalletType.EXTENSION &&
        getProvider() === null && (
          <h2 className="error">
            Please install a wallet to use this example configuration
          </h2>
        )}
      <h3>{`Wallet Address: ${getWalletAddress()}`}</h3>
      {CurrentWallet.type  === WalletType.EXTENSION &&
        !getWalletAddress() && (
          <button onClick={onConnectWallet}>Connect Wallet</button>
        )}
      <h3>{`Block Number: ${blockNumber + 1}`}</h3>
      <h3>{`Transaction State: ${txState}`}</h3>
      <h3>{`${tokenLiquidity.token0.symbol} Balance: ${token0Balance}`}</h3>
      <h3>{`${tokenLiquidity.token1.symbol} Balance: ${token1Balance}`}</h3>
      <div>
        Positions:{' '}
        {positionInfoStrings.map((s, i) => (
          <p key={i}>{s}</p>
        ))}
      </div>
      <button
        className="button"
        onClick={onMintPosition}
        disabled={
          txState === TransactionState.Sending ||
          getProvider() === null ||
          CurrentConfig.rpc === ''
        }>
        <p>Mint Position</p>
      </button>
      <button
        className="button"
        onClick={() => {
          onAddLiquidity(positionIds[positionIds.length - 1])
        }}
        disabled={
          txState === TransactionState.Sending ||
          getProvider() === null ||
          CurrentConfig.rpc === '' ||
          positionIds.length === 0
        }>
        <p>Add Liquidity to Position</p>
      </button>
      <button
        className="button"
        onClick={() => {
          onRemoveLiquidity(positionIds[positionIds.length - 1])
        }}
        disabled={
          txState === TransactionState.Sending ||
          getProvider() === null ||
          CurrentConfig.rpc === '' ||
          positionIds.length === 0
        }>
        <p>Remove Liquidity from Position</p>
      </button>
    </div>
  )
}

export default Example
