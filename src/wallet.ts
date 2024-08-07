// This file contains code to easily connect to and get information from a wallet on chain

import {Currency} from './entities/currency'
import {BigNumber, ethers} from 'ethers'
import {providers} from 'ethers'
import JSBI from 'jsbi'

import {
  CurrentConfig,
} from './config'
import {
  ERC20_ABI,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
  WETH_ABI
} from './constants'
import {getProvider, getWalletAddress, sendTransaction} from './providers'
import {toReadableAmount} from './utils1'

export async function getCurrencyBalance(
    provider: providers.Provider,
    address: string,
    currency: Currency
): Promise<string> {
  // Handle ETH directly
  if (currency.isNative || currency.address.toLowerCase() == CurrentConfig.TC_CONTRACT_ADDRESS.toLowerCase()) {
    return ethers.utils.formatEther(await provider.getBalance(address))
  }

  // Get currency otherwise
  const ERC20Contract = new ethers.Contract(
      currency.address,
      ERC20_ABI,
      provider
  )
  const balance: number = await ERC20Contract.balanceOf(address)
  const decimals: number = await ERC20Contract.decimals()

  // Format with proper units (approximate)
  return toReadableAmount(balance, decimals)
}

export async function getCurrencyApproveRouter(
    provider: providers.Provider,
    address: string,
    currency: Currency
): Promise<number> {
  // Handle ETH directly
  if (currency.isNative) {
    return -1
  }

  console.log("address",address)

  // Get currency otherwise
  const ERC20Contract = new ethers.Contract(
      currency.address,
      ERC20_ABI,
      provider
  )
  const amountAprrove: number = await ERC20Contract.allowance(address,CurrentConfig.SWAP_ROUTER_ADDRESS)
  console.log("address1",address)
  const decimals: number = await ERC20Contract.decimals()
  console.log("amountAprrove",amountAprrove)

  // Format with proper units (approximate)
  return Number(toReadableAmount(amountAprrove, decimals))
}


// wraps ETH (rounding up to the nearest ETH for decimal places)
export async function wrapETH(eth: number) {
  const provider = getProvider()
  const address = getWalletAddress()
  if (!provider || !address) {
    throw new Error('Cannot wrap ETH without a provider and wallet address')
  }

  const wethContract = new ethers.Contract(
      CurrentConfig.WETH_CONTRACT_ADDRESS,
      WETH_ABI,
      provider
  )

  const transaction = {
    data: wethContract.interface.encodeFunctionData('deposit'),
    value: BigNumber.from(Math.ceil(eth))
        .mul(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)).toString())
        .toString(),
    from: address,
    to: CurrentConfig.WETH_CONTRACT_ADDRESS,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  }

  await sendTransaction(transaction)
}

// unwraps ETH (rounding up to the nearest ETH for decimal places)
export async function unwrapETH(eth: number) {
  const provider = getProvider()
  const address = getWalletAddress()
  if (!provider || !address) {
    throw new Error('Cannot unwrap ETH without a provider and wallet address')
  }

  const wethContract = new ethers.Contract(
      CurrentConfig.WETH_CONTRACT_ADDRESS,
      WETH_ABI,
      provider
  )

  const transaction = {
    data: wethContract.interface.encodeFunctionData('withdraw', [
      BigNumber.from(Math.ceil(eth))
          .mul(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)).toString())
          .toString(),
    ]),
    from: address,
    to: CurrentConfig.WETH_CONTRACT_ADDRESS,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  }

  await sendTransaction(transaction)
}

/*
export async function buyTCFee(need_amount_tc = '0.1', tokenType?: TokenType){
  const tokenAddress =
      tokenType === 'ETH' ? TOKEN_ADDRESS.ETH_ADDRESS_L2 : BTC_L2_ADDRESS;
  let [tokenBuyPrice, chainNetwork, userAmountBTC] = await Promise.all([
    this.getBTCPrice(),
    this.gameWalletProvider.gameWallet?.provider.getNetwork(),
    this.contract
        .getERC20Contract(tokenAddress)
        .connect(this.wallet)
        .balanceOf(this.wallet.address),
  ]);

  if (tokenType === 'ETH') {
    tokenBuyPrice = BigNumber.from('145000000000000000000');
  }
  const amountApprove = await this.contract
      .getERC20Contract(tokenAddress)
      .allowance(this.wallet.address, ALPHA_KEY_FACTORY_ADDRESS);
  if (BigNumber.from(amountApprove).lt(parseEther('1'))) {
    const txApprove = await this.contract
        .getERC20Contract(tokenAddress)
        .connect(this.wallet)
        .approve(ALPHA_KEY_FACTORY_ADDRESS, ethers.constants.MaxUint256);
    await txApprove.wait();
  }

  const estimateBTCAmount = parseEther(need_amount_tc)
      .mul(parseEther(tokenType === 'ETH' ? '0.1' : '1'))
      .div(tokenBuyPrice);

  let amountBTC = estimateBTCAmount;

  if (BigNumber.from(estimateBTCAmount).gt(userAmountBTC)) {
    amountBTC = BigNumber.from(userAmountBTC).gt(estimateBTCAmount)
        ? amountBTC
        : userAmountBTC;
  }

  try {
    const akf = this.contract.getAlphaKeysFactoryContract();
    const nonce = BigNumber.from(ethers.utils.randomBytes(32));

    const chainId = chainNetwork?.chainId as number;

    const messagePack = ethers.utils.defaultAbiCoder.encode(
        [
          'address',
          'uint256',
          'uint256',
          'address',
          'uint256',
          'uint256',
          'uint256',
        ],
        [
          akf.address,
          chainId,
          nonce,
          this.wallet.address,
          amountBTC,
          tokenBuyPrice,
          ethers.constants.MaxUint256,
        ]
    );

    const messageHash = ethers.utils.keccak256(
        ethers.utils.arrayify(messagePack)
    );
    const signature = await this.wallet.signMessage(
        ethers.utils.arrayify(messageHash)
    );

    const data_hex = akf.interface.encodeFunctionData(
        (tokenType === 'ETH' ? 'requestETH2TC' : 'requestTC') as any,
        [
          nonce,
          this.wallet.address,
          amountBTC,
          tokenBuyPrice,
          ethers.constants.MaxUint256,
          signature,
        ]
    );
    const result: any = await this.tradeAPI.sendTx({
      contract_address: akf.address,
      data_hex,
    });
    const r: any =
        await this.gameWalletProvider.gameWallet?.provider.getTransaction(
            result
        );
    await r.wait();
    await this.assetContext.fetchAssets();
    return;
  } catch (error) {
    errorLogger.report({
      action: errorLogger.ERROR_LOGGER_TYPE.BUY_TC,
      address: this.wallet.address,
      error: JSON.stringify(error),
      info: JSON.stringify({
        userAmountBTC: userAmountBTC.toString(),
        amountBTC: amountBTC.toString(),
      }),
    });
    await this.getFaucet();
    throw error;
  }
};


export async function estimateTCGasFee ({
                                          type,
                                          needFeeTC,
                                        }: {
  type: ETypes;
  needFeeTC?: any;
}) {
  const _needFeeTC = ceil(needFeeTC || typeToFee[type]);
  console.log('_needFeeTC', _needFeeTC, typeToFee[type]);

  let isBuy = false;

  try {
    const [amount, amountBTC] = await Promise.all([
      gameWalletProvider.gameWallet?.provider.getBalance(
          gameWalletProvider.gameWallet.address
      ),
      contract
          .getERC20Contract(BTC_L2_ADDRESS)
          .connect(wallet)
          .balanceOf(wallet.address),
    ]);


    console.log(
        'aaaa',
        amountBTC.toString(),
        BigNumber.from(amountBTC).gt('0')
    );

    if (
        BigNumber.from(amount?.toString()).lt(parseEther('0.0005')) &&
        BigNumber.from(amountBTC).gt('0')
    ) {
      const amountApprove = await this.contract
          .getERC20Contract(BTC_L2_ADDRESS)
          .allowance(this.wallet.address, ALPHA_KEY_FACTORY_ADDRESS);

      if (BigNumber.from(amountApprove).lt(parseEther('1'))) {
        await this.getFaucet();
        const txApprove = await this.contract
            .getERC20Contract(BTC_L2_ADDRESS)
            .connect(this.wallet)
            .approve(ALPHA_KEY_FACTORY_ADDRESS, ethers.constants.MaxUint256);
        await txApprove.wait();
        isBuy = true;
      }
    }


    const gasPrice = await this.contract.provider?.getGasPrice();
    const gasFee = new NBigNumber(_needFeeTC).multipliedBy(
        gasPrice?.toString() as string
    );
    console.log(
        'gasFee',
        gasFee.toString(),
        BigNumber.from(amount?.toString()).lt(gasFee.toString()),
        amount?.toString()
    );

    if (
        BigNumber.from(amount?.toString()).lt(parseEther('0.001')) ||
        BigNumber.from(amount?.toString()).lt(gasFee.toString())
    ) {
      await this.buyTCFee(this.MIN_BUY_TC);
      isBuy = true;
    }
  } catch (error) {
    console.log('error', error);

    isBuy = false;
    throw error;
  }

  return isBuy;
};
*/