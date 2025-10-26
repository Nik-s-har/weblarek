import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ISuccess {
    description: string;
}

export class Success extends Component<ISuccess> {
    protected successDescription: HTMLElement;
    protected successClose: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.successDescription = ensureElement<HTMLElement>(".order-success__description", this.container);
        this.successClose = ensureElement<HTMLButtonElement>(".order-success__close", this.container);

        this.successClose.addEventListener("click", () => {
             this.events.emit("success:close");
        })
       
    }

    set description(value: number) {
        this.successDescription.textContent = String(value);
    }
}