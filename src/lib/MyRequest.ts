import { GetBalanceParams, GetBalanceResponse, objectAny, Request } from "@blobaa/ardor-ts";
import { Error, ErrorCode } from "@blobaa/bba-did-method-handler-ts";


export default class MyRequest extends Request {

    public async getBalance(url: string, params: GetBalanceParams): Promise<GetBalanceResponse> {
        try {
            return await super.getBalance(url, params);
        } catch (error) {
            console.log(error);
            return Promise.reject(this.getError(error));
        }
    }

    private getError(error: objectAny): Error {
        if (error.syscall) {
            return {
                code: ErrorCode.CONNECTION_ERROR,
                description: "Connection error. Could not connect to node."
            };
        }
        if (error.errorCode) {
            return {
                code: ErrorCode.NODE_ERROR,
                description: error.errorDescription
            };
        }
        return error as Error;
    }

}