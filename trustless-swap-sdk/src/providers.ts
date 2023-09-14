import {BaseProvider} from '@ethersproject/providers'
import {BigNumber, ethers, providers} from 'ethers'

import {CurrentConfig, CurrentWallet, WalletType} from './config'

// Single copies of provider and wallet
let mainnetProvider = new ethers.providers.JsonRpcProvider(
    CurrentConfig.rpc
)
let wallet:ethers.Wallet

let browserExtensionProvider : ethers.providers.Web3Provider | null
let walletExtensionAddress: string | null = null

export function refreshProvider(provider:any)
{
  mainnetProvider = new ethers.providers.JsonRpcProvider(
      CurrentConfig.rpc
  )
  if(CurrentWallet.type==WalletType.PRIVATEKEY && CurrentWallet.privateKey!=""){
    wallet =  createWallet()
  }
  else if(CurrentWallet.type==WalletType.EXTENSION){
    if(!provider){
      provider = createBrowserExtensionProvider()
    }
    browserExtensionProvider = provider
  }

}
// Interfaces

export enum TransactionState {
  Failed = 'Failed',
  New = 'New',
  Rejected = 'Rejected',
  Sending = 'Sending',
  Sent = 'Sent',
}

// Provider and Wallet Functions

export function getMainnetProvider(): BaseProvider {
  return mainnetProvider
}

export function getProvider(): providers.Provider | null {
  return CurrentWallet.type === WalletType.EXTENSION
      ? browserExtensionProvider
      : wallet.provider
}

export function getWalletAddress(): string | null {
  return CurrentWallet.type===  WalletType.EXTENSION
      ? walletExtensionAddress
      : wallet.address
}

export async function geSignerAddress(): Promise<string>{
  const signer =  browserExtensionProvider?.getSigner()
  if (!signer) {
    return ""
  }
  const address =  await signer.getAddress()
  console.log("signer address",address)
  return address
}

export async function sendTransaction(
    transaction: ethers.providers.TransactionRequest
): Promise<TransactionState> {
  if (CurrentWallet.type===  WalletType.EXTENSION) {
    transaction.maxFeePerGas = transaction.maxFeePerGas?.toString()
    transaction.maxPriorityFeePerGas = transaction.maxPriorityFeePerGas?.toString()
    return sendTransactionViaExtension(transaction)
  } else {
    if (transaction.value) {
      transaction.value = BigNumber.from(transaction.value)
    }

    //transaction.gasLimit = 1000000
    return sendTransactionViaWallet(transaction)
  }
}

export async function sendTransactionGetReceipt(
    transaction: ethers.providers.TransactionRequest
): Promise<any> {
  if (CurrentWallet.type===  WalletType.EXTENSION) {
    transaction.maxFeePerGas = transaction.maxFeePerGas?.toString()
    transaction.maxPriorityFeePerGas = transaction.maxPriorityFeePerGas?.toString()
    return sendTransactionViaExtensionGetReceipt(transaction)
  } else {
    if (transaction.value) {
      transaction.value = BigNumber.from(transaction.value)
    }
    transaction.gasLimit = 1000000
    return sendTransactionViaWalletReceipt(transaction)
  }
}


export async function connectBrowserExtensionWallet(provider:any = null) {
  if(!provider) {
    if (!window.ethereum) {
      return null
    }

    const {ethereum} = window
    provider = new ethers.providers.Web3Provider(ethereum)
  }

  const accounts = await provider.send('eth_requestAccounts', [])

  if (accounts.length !== 1) {
    return
  }

  walletExtensionAddress = accounts[0]
  return walletExtensionAddress
}

// Internal Functionality

function createWallet(): ethers.Wallet {
  let provider = mainnetProvider
  return new ethers.Wallet(CurrentWallet.privateKey, provider)
}

function createBrowserExtensionProvider(): ethers.providers.Web3Provider | null {
  try {
    return( new ethers.providers.Web3Provider(window?.ethereum, 'any'))
  } catch (e) {
    console.log('No Wallet Extension Found')
    return null
  }
}


// Transacting with a wallet extension via a Web3 Provider
async function sendTransactionViaExtension(
    transaction: ethers.providers.TransactionRequest
): Promise<TransactionState> {
  try {
    const receipt = await browserExtensionProvider?.send(
        'eth_sendTransaction',
        [transaction]
    )
    if (receipt) {
      console.log("Meta mask receipt ",receipt)
      return TransactionState.Sent
    } else {
      return TransactionState.Failed
    }
  } catch (e) {
    console.log("Meta mask error ",e)
    return TransactionState.Rejected
  }
}

// Transacting with a wallet extension via a Web3 Provider
export async function sendTransactionViaExtensionGetReceipt(
    transaction: ethers.providers.TransactionRequest
): Promise<any> {
  try {
    const receipt = await browserExtensionProvider?.send(
        'eth_sendTransaction',
        [transaction]
    )
    if (receipt) {
      console.log("Meta mask receipt ",receipt)
      return [TransactionState.Sent,receipt]
    } else {
      return [TransactionState.Failed,null]
    }
  } catch (e) {
    console.log("Meta mask error ",e)
    return [TransactionState.Rejected,null]
  }
}

async function sendTransactionViaWallet(
    transaction: ethers.providers.TransactionRequest
): Promise<TransactionState> {
  if (transaction.value) {
    transaction.value = BigNumber.from(transaction.value)
  }
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
      console.log(`Receipt recived:`, receipt)
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

async function sendTransactionViaWalletReceipt(
    transaction: ethers.providers.TransactionRequest
): Promise<any> {
  if (transaction.value) {
    transaction.value = BigNumber.from(transaction.value)
  }
  const txRes = await wallet.sendTransaction(transaction)

  let receipt = null
  const provider = getProvider()
  if (!provider) {
    return [TransactionState.Failed,null]
  }

  while (receipt === null) {
    try {
      receipt = await provider.getTransactionReceipt(txRes.hash)

      if (receipt === null) {
        continue
      }
      console.log(`Receipt recived:`, receipt)
    } catch (e) {
      console.log(`Receipt error:`, e)
      break
    }
  }

  // Transaction was successful if status === 1
  if (receipt) {
    return [TransactionState.Sent,receipt]
  } else {
    return [TransactionState.Failed,null]
  }
}