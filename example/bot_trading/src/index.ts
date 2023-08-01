import {CronJob} from 'cron';
import {CurrentConfig, Environment, choiceConFig, setTOkenSwap, changeWallet, MIN_REQUIRE_AMOUNT_OUT1, MIN_REQUIRE_AMOUNT_OUT2,CRON_STRING} from './libs/config'
import {
    connectBrowserExtensionWallet,
    getProvider,
    getWalletAddress,
    TransactionState,
    refreshProvider,
} from './libs/providers'

import {createTrade, executeTrade, TokenTrade} from './libs/trading'
import {getCurrencyBalance} from './libs/wallet'

class Foo {

    cronJob: CronJob;

    constructor() {
        changeWallet("0x3B6c50437765f996A609eA479766141BB7903761","")


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
   /*
    async init() {
        refreshProvider()
        changeWallet("0x3B6c50437765f996A609eA479766141BB7903761", "")

    }*/

    cronTrade = async (): Promise<void> => {
        console.log((new Date()).toString())
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