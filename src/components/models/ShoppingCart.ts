import { IProduct } from '../../types/index.ts';
import { IEvents } from '../base/Events.ts';

export class ShoppingCart {
    private cartItems: IProduct[] = [];

    constructor(protected events: IEvents) {}

    getCartItems(): IProduct[] {
        return [...this.cartItems];
    }

    addProduct(product: IProduct): void {
        this.cartItems.push({...product});
        this.events.emit("shoppingCart:change");
    }

    deleteProduct(product: IProduct): void {
        const deleteIndex:number = this.cartItems.findIndex((item) => item.id === product.id);
        if (deleteIndex !== -1) {
            this.cartItems.splice(deleteIndex, 1);
            this.events.emit("shoppingCart:change");
        }
    }

    clearCart(): void {
        this.cartItems = [];
        this.events.emit("shoppingCart:clearCart");
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