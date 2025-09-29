import { IProduct } from '../../types/index.ts';

export class ProductCatalog {
    protected productList: IProduct[] = [];
    protected selectedProduct: IProduct | null = null;

    saveProducts(data: IProduct[]): void {
        this.productList = [...data];
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
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}