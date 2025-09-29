import { IProduct } from '../../types/index.ts';

export class ShoppingCart {
    private cartItems: IProduct[] = [];

    getCartItems(): IProduct[] {
        return [...this.cartItems];
    }

    addProduct(product: IProduct): void {
        this.cartItems.push({...product});
    }

    deleteProduct(product: IProduct): void {
        const deleteIndex:number = this.cartItems.findIndex((item) => item === product);
        if (deleteIndex !== -1) {
            this.cartItems.splice(deleteIndex, 1);
        }
    }

    clearCart(): void {
        this.cartItems = [];
    }

    getTotalCost(): number {
        let totalCost = 0;
        this.cartItems.forEach((item) => {
            if (item.price !== null ) totalCost += item.price;
        })
        return totalCost;
    }

    getQuantityProducts(): number {
        return this.cartItems.length;
    }

    isInCart(id: string): boolean {
        for (let product of this.cartItems) {
            if (product.id === id) return true;
        }
        return false;
    }
}