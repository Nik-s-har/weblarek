import { IProduct } from '../../types/index.ts';
import { IEvents } from '../base/Events.ts';

export class ProductCatalog {
    protected productList: IProduct[] = [];
    protected selectedProduct: IProduct | null = null;

    constructor(protected events: IEvents) {}

    saveProducts(data: IProduct[]): void {
        this.productList = [...data];
        this.events.emit("productCatalog:showProducts");
    }

    getProductList(): IProduct[] {
        return [...this.productList];
    }

    getProductById(id: string): IProduct | undefined {
        for (let product of this.productList) {
            if (product.id === id) {
                return product;
            }
        }
        return undefined;
    }

    saveSelectedProduct(product: IProduct): void {
        this.selectedProduct = {...product};
        this.events.emit("productCatalog:saveSelectedProduct");
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }

    clearSelectedProduct() {
        this.selectedProduct = null;
    }
}