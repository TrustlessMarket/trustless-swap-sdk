import { BaseProvider } from '@ethersproject/providers'
import { BigNumber, ethers, providers } from 'ethers'

import { CurrentConfig,CurrentWallet } from './config'

// Single copies of provider and wallet
let currentProvider = new ethers.providers.JsonRpcProvider(
    CurrentConfig.rpc
)
let wallet:ethers.Wallet
let setWallet = false
export enum TransactionState {
  Failed = 'Failed',
  New = 'New',
  Rejected = 'Rejected',
  Sending = 'Sending',
  Sent = 'Sent',
}

// Provider and Wallet Functions

export function getMainnetProvider(): BaseProvider {
  return currentProvider
}
export function refreshProvider()
{
  currentProvider = new ethers.providers.JsonRpcProvider(
      CurrentConfig.rpc
  )
}

export function getProvider(): providers.Provider | null {
  return  currentProvider
}

export function getWalletAddress(): string | null {
  return  CurrentWallet.address
}

export async function sendTransaction(
    transaction: ethers.providers.TransactionRequest
): Promise<TransactionState> {

  if (transaction.value) {
    transaction.value = BigNumber.from(transaction.value)
  }
  return sendTransactionViaWallet(transaction)
}

export async function connectBrowserExtensionWallet() {
  /* if (!window.ethereum) {
     return null
   }

   const { ethereum } = window
   const provider = new ethers.providers.Web3Provider(ethereum)
   const accounts = await provider.send('eth_requestAccounts', [])

   if (accounts.length !== 1) {
     return
   }

   walletExtensionAddress = accounts[0]
   return walletExtensionAddress
 */
  return null
}

// Internal Functionality

export function connectWallet(): ethers.Wallet {

  let provider = currentProvider
  if(!setWallet) {
    wallet = new ethers.Wallet(CurrentWallet.privateKey, provider)
  }
  setWallet =true
  return  wallet
}
async function sendTransactionViaWallet(
    transaction: ethers.providers.TransactionRequest
): Promise<TransactionState> {
  if (transaction.value) {
    transaction.value = BigNumber.from(transaction.value)
  }
  connectWallet()
  const txRes = await wallet.sendTransaction(transaction)

  let receipt = null
  const provider = getProvider()
  if (!provider) {
    return TransactionState.Failed
  }

  while (receipt === null) {
    try {
      receipt = await provider.getTransactionReceipt(txRes.hash)

      if (receipt === null) {
        continue
      }
    } catch (e) {
      console.log(`Receipt error:`, e)
      break
    }
  }

  // Transaction was successful if status === 1
  if (receipt) {
    return TransactionState.Sent
  } else {
    return TransactionState.Failed
  }
}
