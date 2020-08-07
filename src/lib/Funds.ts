import { ChainId, chainCurrency, ChainCurrencyType } from "@blobaa/ardor-ts";
import MyRequest from "./MyRequest";

export default class Funds {
    public static async checkFunds(url: string, accountRs: string, minBalance: number): Promise<void> {
        const request = new MyRequest();
        const balance = await request.getBalance(url, { account: accountRs, chain: ChainId.IGNIS });
        const ignis = chainCurrency.convertFromBaseUnit(parseInt(balance.balanceNQT), ChainCurrencyType.IGNIS);

        if (ignis < minBalance) {
            return Promise.reject({ description: "You need at least " + minBalance + " IGNIS to cover the fees" });
        }
    }

}