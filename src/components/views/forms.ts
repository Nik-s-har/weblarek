import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IForm {
    submit: boolean;
    errors: string;
}

interface IFormOrder extends IForm{
    payment: "cart" | "cash" | "";
    address: string;
}

interface IFormContacts extends IForm{
    email: string;
    phone: string;
}

class Form<T extends IForm> extends Component<T> {
    protected submiteButton: HTMLButtonElement;
    protected formErrors: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.submiteButton = ensureElement<HTMLButtonElement>(".modal__actions .button", this.container);
        this.formErrors = ensureElement<HTMLElement>(".form__errors", this.container);

        this.container.addEventListener("submit", (event) => {
            event.preventDefault();
            this.events.emit("form:submit", {formName: this.container.getAttribute('name')});
        })

    }

    set submit(active: boolean) {
        this.submiteButton.disabled = active;
    }

    set errors(value: string)  {
        this.formErrors.textContent = value;
    }
} 

export class FormOrder extends Form<IFormOrder> {
    protected buttonCart: HTMLButtonElement;
    protected buttonCash: HTMLButtonElement;
    protected inputAddress: HTMLInputElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this.buttonCart = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.buttonCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.inputAddress = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.buttonCart.addEventListener("click", () => {
            this.events.emit("form:card");
        })

        this.buttonCash.addEventListener("click", () => {
            this.events.emit("form:cash");
        })

        this.inputAddress.addEventListener("change", () => {
            this.events.emit("form:address", {address: this.inputAddress.value})
        })
    }

    set payment(value: string) {
        switch (value) {
            case "card":
                this.buttonCart.classList.add("button_alt-active");
                this.buttonCash.classList.remove("button_alt-active");
                break;
            case "cash":
                this.buttonCart.classList.remove("button_alt-active");
                this.buttonCash.classList.add("button_alt-active");
                break;
            case "":
                this.buttonCart.classList.remove("button_alt-active");
                this.buttonCash.classList.remove("button_alt-active");
                break;
        }
    }

    set address(value: string) {
        this.inputAddress.value = value;
    }
}

export class FormContacts extends Form<IFormContacts> {
    protected inputEmail: HTMLInputElement;
    protected inputPhone: HTMLInputElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this.inputEmail = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.inputPhone = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.inputEmail.addEventListener("change", () => {
            this.events.emit("form:email", {email: this.inputEmail.value})
        })

        this.inputPhone.addEventListener("change", () => {
            this.events.emit("form:phone", {phone: this.inputPhone.value})
        })
    }

    set email(value: string) {
        this.inputEmail.value = value;

    }

    set phone(value: string) {
        this.inputPhone.value = value;
    }
}


