import {CronJob} from 'cron';
import {Token} from 'trustless-swap-sdk'
import { CurrentConfig, Environment,WalletType,setTOkenSwap,setTOkenIn,setTOkenOut,changeWallet,tokenSwap,CurrentWallet,
    connectBrowserExtensionWallet,
    getProvider,
    getWalletAddress,
    TransactionState,
    refreshProvider, createTrade, executeTrade, TokenTrade,setTokens,gettokenIndex,
    displayTrade,getCurrencyBalance
} from "trustless-swap-sdk"




import {createTrade, executeTrade, TokenTrade} from './libs/trading'
import {getCurrencyBalance} from './libs/wallet'

class Foo {

    cronJob: CronJob;

    constructor() {
        changeWallet("0x3B6c50437765f996A609eA479766141BB7903761","c46e21b81b8b70e0fdcbd537a9dd52fccd86a116ea2e998b2163ba51cd3c9bc4")


         this.cronJob = new CronJob(CRON_STRING, async () => {
             try {
                 await this.cronTrade();
             } catch (e) {
                 console.error(e);
             }
         });

         // Start job
         if (!this.cronJob.running) {
             this.cronJob.start();
         }
    }

    cronTrade = async (): Promise<void> => {
        const trade1 = await createTrade(true)
        if(parseFloat(trade1.outputAmount.toExact())>MIN_REQUIRE_AMOUNT_OUT1)
        {
            const result = await  executeTrade(trade1)
            return
        }
        const trade2 = await createTrade(false)
        if(parseFloat(trade2.outputAmount.toExact())>MIN_REQUIRE_AMOUNT_OUT2)
        {
            const result = await  executeTrade(trade2)
            return
        }
    }
}

const foo = new Foo();