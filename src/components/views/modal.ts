import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModalContainer {
    content: HTMLElement,
    active: boolean
}

export class ModalContainer extends Component<IModalContainer> {
    modalClose: HTMLButtonElement;
    modalContent: HTMLDivElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.modalClose = ensureElement<HTMLButtonElement>(".modal__close", this.container);
        this.modalContent = ensureElement<HTMLDivElement>(".modal__content", this.container);

        this.modalClose.addEventListener("click", () => {
            this.events.emit("modal:close");
        })
        this.container.addEventListener("click", (event: Event) => {
            if (event.target === this.container) {
                this.events.emit("modal:close");
            }
        })
    }

    set content(modalContent: HTMLElement) {
        this.modalContent.replaceChildren(modalContent);
    }

    set active(modalActive: boolean) {
        if (modalActive) {
            this.container.classList.add('modal_active');
        } else {
            this.container.classList.remove('modal_active');
        }       
    }
}