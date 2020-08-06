import { ChainId, request, chainCurrency, ChainCurrencyType } from "@blobaa/ardor-ts";

export default class Funds {
    public static async checkFunds(url: string, accountRs: string, minBalance: number): Promise<void> {
        const balance = await request.getBalance(url, { account: accountRs, chain: ChainId.IGNIS });
        const ignis = chainCurrency.convertFromBaseUnit(parseInt(balance.balanceNQT), ChainCurrencyType.IGNIS);

        if (ignis < minBalance) {
            return Promise.reject("You need at least " + minBalance + " IGNIS to cover the fees");
        }
    }

}