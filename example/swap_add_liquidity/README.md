# Trading

## Overview

This is an example of executing a quoted swap trade that includes running against mainnet, testnet, using a wallet connection.

You can connect NOS on main net, test net create and  excute a trade

1. Change network
   - choiceConFig(Environment)
   - refreshProvider()
2. Link your wallet
   -  changeWallet(address,privateKey)
3. Custom token
   -  setTOkenSwap(inputToken,amountIn,outToken, poolFee)
