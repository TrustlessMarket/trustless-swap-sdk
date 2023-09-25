import './Example.css'

import React, { useCallback, useEffect, useState } from 'react'

import { CurrentConfig, Environment,choiceConFig,setTOkenSwap,changeWallet,tokenSwap } from '../config'
import {
    connectBrowserExtensionWallet,
    getProvider,
    getWalletAddress,
    TransactionState,
    refreshProvider,
} from '../libs/providers'

import { createTrade, executeTrade, TokenTrade } from '../libs/trading'
import { displayTrade } from '../libs/utils'
import { getCurrencyBalance } from '../libs/wallet'

{
 // choiceConFig(Environment.MAINNET)
  refreshProvider()
  changeWallet("0x3B6c50437765f996A609eA479766141BB7903761","c46e21b81b8b70e0fdcbd537a9dd52fccd86a116ea2e998b2163ba51cd3c9bc4")
  setTOkenSwap(CurrentConfig.tokens_list[0],1,CurrentConfig.tokens_list[3],3000)
}
/*
import { CurrentConfig, Environment } from '../config'
import { connectBrowserExtensionWallet, getProvider, getWalletAddress, TransactionState } from '../libs/providers'
import { createTrade, executeTrade, TokenTrade } from '../libs/trading'
import { displayTrade } from '../libs/utils'
import { getCurrencyBalance, wrapETH } from '../libs/wallet'
*/


const useOnBlockUpdated = (callback: (blockNumber: number) => void) => {
  useEffect(() => {
    const subscription = getProvider()?.on('block', callback)
    return () => {
      subscription?.removeAllListeners()
    }
  })
}

const Example = () => {
  const [trade, setTrade] = useState<TokenTrade>()
  const [txState, setTxState] = useState<TransactionState>(TransactionState.New)

  const [tokenInBalance, setTokenInBalance] = useState<string>()
  const [tokenOutBalance, setTokenOutBalance] = useState<string>()
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
    if (!address || !provider) {
      return
    }

    setTokenInBalance(await getCurrencyBalance(provider, address, tokenSwap.in))
    setTokenOutBalance(await getCurrencyBalance(provider, address, tokenSwap.out))
  }, [])

  // Event Handlers

  const onConnectWallet = useCallback(async () => {
    if (await connectBrowserExtensionWallet()) {
      refreshBalances()
    }
  }, [refreshBalances])

  const onCreateTrade = useCallback(async () => {
    refreshBalances()
    setTrade(await createTrade())
  }, [refreshBalances])

  const onTrade = useCallback(async (trade: TokenTrade | undefined) => {
    if (trade) {
      setTxState(await executeTrade(trade))
    }
  }, [])

  return (
      <div className="App">
        {CurrentConfig.rpc === '' && <h2 className="error">Please set your mainnet RPC URL in config.ts</h2>}

        <h3>
          Trading {tokenSwap.amountIn} {tokenSwap.in.symbol} for {tokenSwap.out.symbol}
        </h3>
        <h3>{trade && `Constructed Trade: ${displayTrade(trade)}`}</h3>
        <button onClick={onCreateTrade}>
          <p>Create Trade</p>
        </button>
        <h3>{`Wallet Address: ${getWalletAddress()}`}</h3>

        <h3>{`Block Number: ${blockNumber + 1}`}</h3>
        <h3>{`Transaction State: ${txState}`}</h3>
        <h3>{`${tokenSwap.in.symbol} Balance: ${tokenInBalance}`}</h3>
        <h3>{`${tokenSwap.out.symbol} Balance: ${tokenOutBalance}`}</h3>

        <button
            onClick={() => onTrade(trade)}
            disabled={
                trade === undefined ||
                txState === TransactionState.Sending ||
                getProvider() === null ||
                CurrentConfig.rpc === ''
            }
        >
          <p>Trade</p>
        </button>
      </div>
  )
}

export default Example
