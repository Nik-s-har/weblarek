import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
    list: HTMLElement[],
    totalPrice: number
}

export class Basket extends Component<IBasket>  {
    basketButton: HTMLButtonElement;
    basketList: HTMLUListElement;
    basketPrice: HTMLSpanElement;
    

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.basketButton = ensureElement<HTMLButtonElement>(".basket__button", this.container);
        this.basketList = ensureElement<HTMLUListElement>(".basket__list", this.container);
        this.basketPrice = ensureElement<HTMLSpanElement>(".basket__price", this.container);

        //Устанавливаем начальное значение корзины
        this.basketList.innerHTML = '<li>Корзина пуста</li>';
        this.basketList.classList.add('basket__empty');
        this.basketButton.disabled = true;

        this.basketButton.addEventListener("click", () => {
            this.events.emit("basket:order")
        })
    }

    set list(basketItems: HTMLElement[]) {
        if (!basketItems.length) {
            this.basketList.innerHTML = '<li>Корзина пуста</li>';
            this.basketList.classList.add('basket__empty');
            this.basketButton.disabled = true;
            return;
        }
        this.basketList.innerHTML = '';
        this.basketButton.disabled = false;
        this.basketList.classList.remove('basket__empty');
        basketItems.forEach(item => {
            this.basketList.appendChild(item);
        });
    }

    set totalPrice(value: number) {
        this.basketPrice.textContent = String(value);
    }
}