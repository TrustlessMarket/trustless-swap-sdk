import './Example.css'

import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import {Token} from 'trustless-swap-sdk'
import { CurrentConfig, Environment,WalletType,setTOkenSwap,setTOkenIn,setTOkenOut,changeWallet,tokenSwap,CurrentWallet,
    connectBrowserExtensionWallet,
    getProvider,
    getWalletAddress,
    TransactionState,executeTradeSlippage,
    refreshProvider, createTrade, TokenTrade,setTokens,gettokenIndex,
    displayTrade,choiceConFig,getCurrencyBalance,getBestRouteExactIn,
} from 'trustless-swap-sdk'
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


    choiceConFig(Environment.MAINNET)
    changeWallet(WalletType.PRIVATEKEY,"","")
    //changeWallet(WalletType.EXTENSION,"","")
    refreshProvider(null)
    setTOkenSwap(CurrentConfig.tokens_list[0],1,CurrentConfig.tokens_list[2],10000)
}


const getList = async () => {

    try {
        const res = await fetch(
            "https://dex-api.newbitcoincity.com"+`/api/swap/token/list/v1?is_test=&limit=500&network=nos&page=1`,
        ).then((res) => {
            return res.json();
        });
        listToken =[]
        for(let index = 0; index<res.data.length; index++)
        {
            listToken.push(res.data[index])
            options.push( { value: res.data[index].address, label: res.data[index].symbol })
        }
        setTokens(listToken)
        console.log("listToken",listToken)

        // setList(res || []);
    } catch (error) {

    } finally {

    }
}


getList()



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

        const index1 = gettokenIndex(listToken,select1)
        const index2 = gettokenIndex(listToken,select2)

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

        select1 = selectedOption.value
        options2 = []
        const res = await fetch(
            "https://dex-api.newbitcoincity.com"+`/api/swap/token/list/v1?from_token=`+selectedOption.value+`&is_test=&limit=500&network=nos&page=1`,
        ).then((res) => {
            return res.json()
        });
        for(let index = 0; index<res.data.length; index++)
        {
            listToken.push(res.data[index])
            options2.push( { value: res.data[index].address, label: res.data[index].symbol })
        }
    };

    // Update wallet state given a block number
  const refreshBalances = useCallback(async () => {
    const provider = getProvider()
    const address = getWalletAddress()
    if (!address || !provider) {
      return
    }
console.log("tokenSwap.in",tokenSwap.in)
      console.log("ttokenSwap.out",tokenSwap.out)

    setTokenInBalance(await getCurrencyBalance(provider, address, tokenSwap.in))
   setTokenOutBalance(await getCurrencyBalance(provider, address, tokenSwap.out))
  }, [])

  // Event Handlers
  const onConnectWallet = useCallback(async () => {
    if (await connectBrowserExtensionWallet(null)) {
      refreshBalances()
    }
  }, [refreshBalances])

  const onCreateTrade = useCallback(async () => {
     const index1 = gettokenIndex(listToken,select1)
      const index2 = gettokenIndex(listToken,select2)
      if(index1<0||index2<0)
      {
          alert("Invalid token")
          return ;
      }
      const in_amount =parseFloat( getValues("amount").toString());

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
      console.log("in_amount",in_amount)
      const rs1 = await getBestRouteExactIn(in_amount)
      console.log("rs1getBestRouteExactIn",rs1)
     setTrade(rs1[2])
  }, [refreshBalances])

  const onTrade = useCallback(async (trade: TokenTrade | undefined) => {
      const values = getValues();
      if (trade) {
          const rs = await executeTradeSlippage(trade,50)
      setTxState(rs[0])
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

