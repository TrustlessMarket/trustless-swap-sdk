import './Example.css'

import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { CurrentConfig, Environment,WalletType,choiceConFig,setTOkenSwap,setTOkenIn,setTOkenOut,changeWallet,tokenSwap,CurrentWallet } from '../config'
import {
    connectBrowserExtensionWallet,
    getProvider,
    getWalletAddress,
    TransactionState,
    refreshProvider,
} from '../libs/providers'

import { createTrade, executeTrade, TokenTrade } from '../libs/trading'
import { displayTrade } from '../libs/utils'
import { Token } from 'trustless-swap-sdk'
import { getCurrencyBalance } from '../libs/wallet'
import Select from 'react-select';

let options:any[] = [
    /*
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },

     */
];
let options2:any[] = [
    ]

let listToken :any[] = [
]
let select1= ""
let select2= ""



{

 // choiceConFig(Environment.MAINNET)
 // refreshProvider()
    changeWallet(WalletType.PRIVATEKEY,"0x3B6c50437765f996A609eA479766141BB7903761","c46e21b81b8b70e0fdcbd537a9dd52fccd86a116ea2e998b2163ba51cd3c9bc4")
    //changeWallet(WalletType.EXTENSION,"","")
    refreshProvider()
  setTOkenSwap(CurrentConfig.tokens_list[0],1,CurrentConfig.tokens_list[2],3000)
}
let API_ROOT = ''
if (CurrentConfig.env == Environment.MAINNET)
{
    API_ROOT ="https://www.fprotocol.io"
}else  if (CurrentConfig.env == Environment.TESTNET)
{
    API_ROOT ="https://dev.fprotocol.io"
}
function  gettoken(listToken :any[],address:string) {
    let position = -1
    for(let index = 0; index<listToken.length; index++) {
     if(listToken[index].address==address)
     {
         position = index
     }
    }
    return position
}
const getList = async () => {
    try {
        const res = await fetch(
            API_ROOT+`/api/swap/token/list/v1?is_test=&limit=500&network=nos&page=1`,
        ).then((res) => {
            return res.json();
        });
        listToken =[]
        for(let index = 0; index<res.data.length; index++)
        {
            listToken.push(res.data[index])
            options.push( { value: res.data[index].address, label: res.data[index].symbol })
        }
        console.log(res);
        // setList(res || []);
    } catch (error) {

    } finally {

    }
}


getList()
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

type FormInputs = {
    amount: number
}

const Example = () => {
  const [trade, setTrade] = useState<TokenTrade>()
    const { register, getValues } = useForm<FormInputs>();


  const [txState, setTxState] = useState<TransactionState>(TransactionState.New)

  const [tokenInBalance, setTokenInBalance] = useState<string>()
  const [tokenOutBalance, setTokenOutBalance] = useState<string>()
  const [blockNumber, setBlockNumber] = useState<number>(0)
    const [selectedOption, setSelectedOption] =  useState("");
  const [selectedOption2, setSelectedOption2] =useState<string>();
    const [address, setaddress] = useState<string>()

    const [selected, setSelected] = useState(null);

  // Listen for new blocks and update the wallet
  useOnBlockUpdated(async (blockNumber: number) => {
    refreshBalances()
    setBlockNumber(blockNumber)
  })





    const handleChange1 = (selectedOption:any) => {
        setSelected(selectedOption.value);
        select2 = selectedOption.value

        const in_amount =parseFloat( getValues("amount").toString());
        // alert(in_amount);

        const index1 = gettoken(listToken,select1)
        const index2 = gettoken(listToken,select2)

        const token1 = new Token(
            1,
            listToken[index1].address,
            listToken[index1].decimal,
            listToken[index1].symbol,
            listToken[index1].symbol)
        const token2 = new Token(
            1,
            listToken[index2].address,
            listToken[index2].decimal,
            listToken[index2].symbol,
            listToken[index2].symbol)
        setTOkenIn(token1);
        setTOkenOut(token2);
        refreshBalances()
    };





    const handleChange = async (selectedOption:any) =>  {


        console.log(`Option selected:`, selectedOption)
        select1 = selectedOption.value
        options2 = []
        const res = await fetch(
            API_ROOT+`/api/swap/token/list/v1?from_token=`+selectedOption.value+`&is_test=&limit=500&network=nos&page=1`,
        ).then((res) => {
            return res.json();
        });
        for(let index = 0; index<res.data.length; index++)
        {
            listToken.push(res.data[index])
            options2.push( { value: res.data[index].address, label: res.data[index].symbol })
        }
        console.log(res);
    };

    // Update wallet state given a block number
  const refreshBalances = useCallback(async () => {
    const provider = getProvider()
    const address = getWalletAddress()
    if (!address || !provider) {
      return
    }
    console.log(address)

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
     const index1 = gettoken(listToken,select1)
      const index2 = gettoken(listToken,select2)
      if(index1<0||index2<0)
      {
          alert("Invalid token")
          return ;
      }
      console.log(options);
     // console.log(option);
      const in_amount =parseFloat( getValues("amount").toString());
     // alert(in_amount);

      const token1 = new Token(
          1,
          listToken[index1].address,
          listToken[index1].decimal,
          listToken[index1].symbol,
          listToken[index1].symbol)
      const token2 = new Token(
          1,
          listToken[index2].address,
          listToken[index2].decimal,
          listToken[index2].symbol,
          listToken[index2].symbol)
      setTOkenSwap(token1,in_amount,token2,3000)
    refreshBalances()
    setTrade(await createTrade())
  }, [refreshBalances])

  const onTrade = useCallback(async (trade: TokenTrade | undefined) => {
      const values = getValues();
      console.log(values);
      if (trade) {
      setTxState(await executeTrade(trade))
    }
  }, [])

  return (

      <div className="App">
        {CurrentConfig.rpc === '' && <h2 className="error">Please set your mainnet RPC URL in config.ts</h2>}
          <h3>From token</h3>
          <h3>{`Wallet Address: ${getWalletAddress()}`}</h3>
          {CurrentWallet.type === WalletType.EXTENSION &&
          !getWalletAddress() && (
              <button onClick={onConnectWallet}>Connect Wallet</button>
          )}

          <Select

              options={options}
              onChange={handleChange}


              styles={{
                  control: (baseStyles, state) => ({
                      ...baseStyles,
                      color:"red !important",
                      borderColor: state.isFocused ? 'grey' : 'red',
                  }),
                  option: (base) => ({
                      ...base,
                      color:"red !important",
                      height: '100%',
                  }),
              }}
          />

          {select1!=="" &&(
          <h3>{`${tokenSwap.in.symbol} Balance: ${tokenInBalance}`}</h3>
          )}

          <h3>To token</h3>
          <Select
              defaultValue={selectedOption2}
              options={options2}
              onChange={handleChange1}


              styles={{
                  control: (baseStyles, state) => ({
                      ...baseStyles,
                      color:"red !important",
                      borderColor: state.isFocused ? 'grey' : 'red',
                  }),
                  option: (base) => ({
                      ...base,
                      color:"red !important",
                      height: '100%',
                  }),
              }}
          />


          {select2!=="" &&(
              <h3>{`${tokenSwap.out.symbol} Balance: ${tokenOutBalance}`}</h3>
          )}

          <h3>Amount swap</h3>

          <input type="text" id="amount" className="text-white"
                 placeholder="Enter amount" {...register('amount', {
              required: "Enter amount",
              maxLength: {value: 255, message: "Cannot Exceed more 255 Characters"}
          })}/>


        <h3>{trade && `Constructed Trade: ${displayTrade(trade)}`}</h3>

        <button  onClick={onCreateTrade}>
          <p>Create Trade</p>
        </button>

          <h3>{`Block Number: ${blockNumber + 1}`}</h3>




        <h3>{`Transaction State: ${txState}`}</h3>



        <button
            onClick={() => onTrade(trade)}
            disabled={
                trade === undefined ||
                txState === TransactionState.Sending ||
                getProvider() === null ||
                CurrentConfig.rpc === ''
            }
        >
          <p>Confirm Trade?</p>
        </button>
      </div>

  )
}

export default Example
