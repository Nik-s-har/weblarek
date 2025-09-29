import { IApi, IGetRespose, IPostBody, IPostResponse } from "../../types";

export class ApiInterface {
    protected api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getProductList(): Promise<IGetRespose> {
        return this.api.get<IGetRespose>("/product/");
    }

    postOrder(data: IPostBody): Promise<IPostResponse> {
        return this.api.post("/order/", data);
    }
}