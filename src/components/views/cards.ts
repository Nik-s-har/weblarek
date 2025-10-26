import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { CDN_URL } from "../../utils/constants";
import { categoryMap } from "../../utils/constants";



interface IProductCard {
    title: string,
    price: number | null
}

interface ICardCatalog extends IProductCard {
    category: string,
    image: string
}

interface ICardPreview extends ICardCatalog {
    text: string
}

interface ICardActions {
    onClick: () => void 
}

interface ICardBasket extends IProductCard {
    index: number
}

class ProductCard<T extends IProductCard> extends Component<T> {
    protected cardTitle: HTMLElement;
    protected cardPrice: HTMLSpanElement;

    constructor(container: HTMLElement, ) {
        super(container);
        this.cardTitle = ensureElement<HTMLElement>(".card__title", this.container);
        this.cardPrice = ensureElement<HTMLSpanElement>(".card__price", this.container);
    }

    set title(value: string) {
        this.cardTitle.textContent = value;
    }

    set price(value: number) {
        this.cardPrice.textContent = String(value);
    }
}

class ExtendedProductCard<T extends ICardCatalog> extends ProductCard<T> {
    protected cardCategory: HTMLSpanElement;
    protected cardImage: HTMLImageElement;

    constructor(container: HTMLElement) {
        super(container);
        this.cardCategory = ensureElement<HTMLSpanElement>(".card__category", this.container);
        this.cardImage = ensureElement<HTMLImageElement>(".card__image", this.container);
    }

    set category(value: CategoryType) {
        this.cardCategory.textContent = value;
        this.cardCategory.classList.remove(...this.cardCategory.classList); 
        this.cardCategory.classList.add("card__category");
        this.cardCategory.classList.add(categoryMap[value]);  //Устанавливаем стили соответствующие категории
    }

    set image(value: string) {
        this.setImage(this.cardImage, CDN_URL+value);
    }
}

export class CardCatalog extends ExtendedProductCard<ICardCatalog> {
    
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        if (actions?.onClick) {
            this.container.addEventListener("click", actions?.onClick);
        }
    }
    
}

export class CardPreview extends ExtendedProductCard<ICardPreview> {
    protected cardText: HTMLElement;
    protected cardButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents, isInCart: boolean, isNull: boolean) {
        super(container);

        this.cardText = ensureElement<HTMLElement>(".card__text", this.container);
        this.cardButton = ensureElement<HTMLButtonElement>(".card__button", this.container);

        if (isNull) {
            this.cardButton.textContent = "Недоступно";
            this.cardButton.disabled = true;
        } else {
            if (!isInCart) {
            this.cardButton.textContent = "В корзину";
            this.cardButton.addEventListener("click", () => {
                this.events.emit("cardPrewiew:addCard");
            })
            } else {
                this.cardButton.textContent = "Удалить";
                this.cardButton.addEventListener("click", () => {
                    this.events.emit("cardPrewiew:delCard", {form: "cardPreview"});
                })
            }   
        }
        
    }

    set text(value: string) {
        this.cardText.textContent = value;
    }

    set btnActive(value: boolean) {
        this.cardButton.disabled = value;
    }
}

export class CardBasket extends ProductCard<ICardBasket> {
    protected basketIndex: HTMLSpanElement;
    protected basketDelete: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.basketIndex = ensureElement<HTMLSpanElement>(".basket__item-index", this.container);
        this.basketDelete = ensureElement<HTMLButtonElement>(".basket__item-delete", this.container);

        if (actions?.onClick) {
            this.basketDelete.addEventListener("click", actions?.onClick);
        }
    }

    set index(value: number) {
        this.basketIndex.textContent = String(value);
    }
}