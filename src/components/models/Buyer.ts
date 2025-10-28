import { IBuyer } from '../../types/index.ts';
import { IEvents } from '../base/Events.ts';

export class Buyer {
    protected buyer: IBuyer = {
            payment: "",
            email: "",
            phone: "",
            address: "",
        };

    constructor(protected events: IEvents) {}

    saveData<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        this.buyer[field] = value;
        this.events.emit("buyer:saveData", {field, value});
        this.validate();
    }

    getBuyerInfo(): IBuyer {
        return this.buyer;
    }

    clearData() {
        this.buyer.address = "";
        this.buyer.payment = "";
        this.buyer.email = "";
        this.buyer.phone = "";
    }

    checkData<K extends keyof IBuyer>(field: K, value: IBuyer[K]): string {
        const message = {
            payment: "Не выбран вид оплаты",
            email: "Укажите емэйл",
            phone: "Укажите номер телефона",
            address: "Укажите адрес",
        }
        if (value === "") return message[field];
        return "";
    }

    validate() {
        const errors = {};
        for (let key in this.buyer) {
            errors[key] = this.checkData(key, this.buyer[key])
        }
        this.events.emit("buyer:validate", errors);
    }
}