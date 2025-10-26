import './scss/styles.scss';
import { API_URL } from './utils/constants.ts';
import { Buyer } from './components/models/Buyer.ts';
import { ProductCatalog } from './components/models/ProductCatalog.ts';
import { ShoppingCart } from './components/models/ShoppingCart.ts';
import { Api } from './components/base/Api.ts';
import { ApiInterface } from './components/communication/ApiInterface.ts';
import { EventEmitter } from './components/base/Events.ts';
import { Header } from './components/views/header.ts';
import { CardCatalog, CardPreview, CardBasket } from './components/views/cards.ts';
import { cloneTemplate, ensureElement } from './utils/utils.ts';
import { Gallery } from './components/views/gallery.ts';
import { ModalContainer } from './components/views/modal.ts';
import { Basket } from './components/views/basket.ts';
import { FormOrder, FormContacts } from './components/views/forms.ts';
import { Success } from './components/views/success.ts';
import { IBuyer, IProduct } from './types/index.ts';


//Создаем брокер событий
const events = new EventEmitter();                 

//Создаем экземпляры модели данных
const catalog = new ProductCatalog(events);         
const shoppingCart = new ShoppingCart(events);
const buyer = new Buyer(events);      

//Создаем экземпляры слоя представления
const headerContainer = ensureElement(".header__container");
const header = new Header(headerContainer, events);
const main = ensureElement(".gallery");
const gallery = new Gallery(main);
const modal = ensureElement("#modal-container");
const modalWindow = new ModalContainer(modal, events);
const basket = new Basket(cloneTemplate("#basket"), events);
let basketView = basket.render({list: undefined, totalPrice: 0});
const formOrder = new FormOrder(cloneTemplate("#order"), events);
const formContacts = new FormContacts(cloneTemplate("#contacts"), events);


//Получаем с сервера массив карточек товаров
const api = new Api(API_URL);                       
const dataInterface = new ApiInterface(api);        
dataInterface.getProductList().then((data) => {     
    catalog.saveProducts(data.items);
}).catch((error) => console.log(error))


//Функция отображения формы с адресом и способами оплаты
function showFormOrder() {
    const buyerInfo = buyer.getBuyerInfo();

    const formOrderInfo = {
        payment: buyerInfo.payment,
        address: buyerInfo.address,
    }
    modalWindow.render({content: formOrder.render(formOrderInfo), active: true});
}

//Функция отображения формы с контактами
function showFormContacts() {
    const buyerInfo = buyer.getBuyerInfo();

    const formContactsInfo = {
        email: buyerInfo.email,
        phone: buyerInfo.phone
    }
    modalWindow.render({content: formContacts.render(formContactsInfo), active: true});
}

//Функция подготовки данных для отправки на сервер
function getPostObj() {
    const buyerInfo = buyer.getBuyerInfo();
    const totalCost = shoppingCart.getTotalCost();
    const cartItems = shoppingCart.getCartItems().map(obj => obj.id);
    const postObj = {
        payment: buyerInfo.payment,
        email: buyerInfo.email,
        phone: buyerInfo.phone,
        address: buyerInfo.address,
        total: totalCost,
        items: cartItems
    }
    return postObj;
}

events.on("productCatalog:saveProducts", () => {
    const productList = catalog.getProductList().map((item) => {
        const newCard = new CardCatalog(cloneTemplate("#card-catalog"), {
            onClick: () => events.emit("cardCatalog:select", item),
        });
        return newCard.render(item);
    }); 
    gallery.render({catalog: productList});
})

events.on("cardCatalog:select", (item: IProduct) => {
    catalog.saveSelectedProduct(item);
})

events.on("productCatalog:saveSelectedProduct", () => {
    const cardSelected = catalog.getSelectedProduct();
    if (cardSelected) {
        const isInCart = shoppingCart.isInCart(cardSelected?.id);
        let isNull = false;
        if (!cardSelected.price) isNull = true;
        const cardPrewiew = new CardPreview(cloneTemplate("#card-preview"), events, isInCart, isNull);
        const card = cardPrewiew.render(cardSelected);
        modalWindow.render({content: card, active: true});
    } 
})

events.on("modal:close", () => {
    modalWindow.render({active: false});
})

events.on("cardPrewiew:addCard", () => {
    const product = catalog.getSelectedProduct();
    if (product?.price) {
        shoppingCart.addProduct(product);
        catalog.clearSelectedProduct();
        modalWindow.render({active: false});
    }
})

events.on("cardPrewiew:delCard", () => {
    const product = catalog.getSelectedProduct();
    if (product) {
        shoppingCart.deleteProduct(product);
        catalog.clearSelectedProduct();
        modalWindow.render({active: false});
    }
})

events.on("shoppingCart:change", () => {
    header.render({counter: shoppingCart.getQuantityProducts()});
    const cartItems = shoppingCart.getCartItems();
    if (cartItems.length) {
        basket.list = cartItems.map((item, index) => {
            const cardBasket = new CardBasket(cloneTemplate("#card-basket"), {
                onClick: () => events.emit("cardBasket:delete", item),
            });
            const data = {
                index: index + 1,
                title: item.title,
                price: item.price
            }
            return cardBasket.render(data);
        })      
    } else {
        basket.list = undefined;
    }
    basket.totalPrice = shoppingCart.getTotalCost();
})

events.on("basket:open", () => {
    modalWindow.render({content: basketView, active: true});
})

events.on("cardBasket:delete", (item: IProduct) => {
    shoppingCart.deleteProduct(item);
})

events.on("basket:order", () => {
    showFormOrder();
})

events.on("form:card", () => {
    buyer.saveData("payment", "card");
})

events.on("form:cash", () => {
    buyer.saveData("payment", "cash");
})

events.on("form:address", (obj: Partial<IBuyer>) => {
    if (obj.address) {
        buyer.saveData("address", obj.address)
    }    
})

events.on("form:email", (obj: Partial<IBuyer>) => {
    if (obj.email) {
        buyer.saveData("email", obj.email);
    }
})

events.on("form:phone", (obj: Partial<IBuyer>) => {
    if (obj.phone) {
        buyer.saveData("phone", obj.phone);
    }
})

interface IBuyerChange {
    field: string;
}

events.on("buyer:saveData", (obj: IBuyerChange) => {
    if (obj.field === "payment" || obj.field === "address") {
        showFormOrder();
    } else {
        showFormContacts();
    }
})

interface IFormSubmit {
    formName: "order" | "contacts";
}

events.on("form:submit", (obj: IFormSubmit) => {
    switch (obj.formName) {
        case "order":
            showFormContacts();
            break;
        case "contacts":
            const data = getPostObj(); //Готовим данные для отправки на сервер
            dataInterface.postOrder(data).then(response => {
                //Очищаем данные корзины и данных покупателя в модели данных
                shoppingCart.clearCart();
                buyer.clearData();

                //Выводим окно с уведомлении об успешном оформлении товара
                const success = new Success(cloneTemplate("#success"), events);
                const successView = success.render({description: `Списано ${response.total} синапсов`});
                modalWindow.render({content: successView, active: true});
            }).catch(err => console.log(err))
            break;
        default: 
            break;
    }
})

events.on("success:close", () => {
    modalWindow.render({active: false});
})

events.on("shoppingCart:clearCart", () => {
    header.render({counter: shoppingCart.getQuantityProducts()});
})

events.on("buyer:validate", (errors) => {
    formOrder.validate(errors); 
    formContacts.validate(errors);
})
