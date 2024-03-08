import {setTOkenSwap,changeWallet,WalletType,Environment,
    choiceConFig} from './config'
import {refreshProvider} from './providers'
//import {ethers} from "ethers" CurrentConfig; wallet
//import QuoterV2ABI from "./QuoterV2.json";
import {getBestRouteExactInNaka} from './trading'
import { Token } from './entities/token'
changeWallet(WalletType.PRIVATEKEY,"0x3B6c50437765f996A609eA479766141BB7903761","c46e21b81b8b70e0fdcbd537a9dd52fccd86a116ea2e998b2163ba51cd3c9bc4")
choiceConFig( Environment.NAKATESTNET);
refreshProvider(null);

const token1 = new Token(
    1,
    "0x0f888a161ca87a2f4dd08e1dbf38aff80388e2ae",
    18,
    "NAKA",
    "NAKA")

const token2 = new Token(
    1,
    "0x1d45c32C97707C916b350042CEAC2164fb6D00A1",
    18,
    "WBTC",
    "WBTC")

/*

const token3 = new Token(
    1,
    "0x0FBa66555B74F13809862BD6f15FffA0A0237059",
    18,
    "WETH",
    "WETH")



  getBestRouteExactInNaka("3.0",true).then((data) => {
    console.log("btcContract.balanceOf",data);
});

 */
//console.log("rs result",rs)

/*
const quoteContract = new ethers.Contract(
    CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    QuoterV2ABI.abi,
    provider
)
 const nonfungiblePositionManager = await ethers.getContractAt("NonfungiblePositionManager", contractCfg.nonfungiblePositionManager.address);
console.log("CurrentConfig",CurrentConfig)

describe("Math functions", async () => {
    await  getBestRouteExactInNaka("3.0",true);
    it("should add two numbers correctly", () => {
        expect(1+2).toEqual(3);
    });
});
*/
test('the fetch fails with an error', async () => {

    //expect.assertions(1);
    try {
       //await tokenTransferApproval(token2,20000)
        setTOkenSwap(token2,parseFloat("0.00001"),token1,3000);

     // const rs =  await  getBestRouteExactInNaka("0.0001",false);
    //  console.log("result rs 14", rs)
        //await executeTradeSlippageNaka(rs[2],50,false);
        //console.log("result rs 15", rs)

        const [rs1,rs2] =
            await Promise.all([
                  getBestRouteExactInNaka("0.00001",false),
                  getBestRouteExactInNaka("0.00001",true)
            ])
            console.log("result r3", rs1)
            console.log("result r4", rs2)
    } catch (e) {
        console.log("result error", e)
    }
});