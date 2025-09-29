import { IBuyer } from '../../types/index.ts';

export class Buyer {
    protected buyer: IBuyer = {
            payment: "",
            email: "",
            phone: "",
            address: "",
        };

    saveData<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        this.buyer[field] = value;
    }

    getBuyerInfo(): IBuyer {
        return this.buyer;
    }

    clearBuyerInfo(): void {
        this.buyer = {
            payment: "",
            email: "",
            phone: "",
            address: "", 
        };
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
}