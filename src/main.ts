import './scss/styles.scss';
import { API_URL } from './utils/constants.ts';
import { Buyer } from './components/models/Buyer.ts';
import { ProductCatalog } from './components/models/ProductCatalog.ts';
import { ShoppingCart } from './components/models/ShoppingCart.ts';
import { apiProducts } from './utils/data.ts';
import { Api } from './components/base/Api.ts';
import { ApiInterface } from './components/communication/ApiInterface.ts';

//Проверка работы методов класса ProductCatalog
const productsModel = new ProductCatalog();
productsModel.saveProducts(apiProducts.items);
console.log("Массив товаров из каталога: ", productsModel.getProductList());
const productItem = productsModel.getProductById("b06cde61-912f-4663-9751-09956c0eed67");
const productItem1 = productsModel.getProductById("412bcf81-7e75-4e70-bdb9-d3c73c9803b7");
if (productItem) productsModel.saveSelectedProduct(productItem);
console.log("Получаем выбранный элемент", 
    productsModel.getSelectedProduct());

//Проверка работы методов класса ShoppingCart   
const cartItem = new ShoppingCart();
if (productItem) cartItem.addProduct(productItem);
if (productItem1) cartItem.addProduct(productItem1);
console.log("Проверяем корзину после добавления товаров", cartItem.getCartItems());
console.log("Получаем количество товаров в корзине", cartItem.getQuantityProducts());
console.log("Получаем суммарную стоимость корзины", cartItem.getTotalCost());
console.log("Проверка наличия товара в корзине по его id=412bcf81-7e75-4e70-bdb9-d3c73c9803b7",
    cartItem.isInCart("412bcf81-7e75-4e70-bdb9-d3c73c9803b7"));
console.log("Проверка наличия товара в корзине по его id=412bcf81-7e75-4e70-bdb9-d3c73c9803b7",
    cartItem.isInCart("854cef69-976d-4c2a-a18c-2aa45046c390"));
if (productItem) cartItem.deleteProduct(productItem);
console.log("Проверяем корзину после удаления одного товара", cartItem.getCartItems());
cartItem.clearCart();
console.log("Содержимое корзины после её очистки", cartItem.getCartItems());

//Проверка работы методов класса Buyer
const buyerItem = new Buyer();
buyerItem.saveData("payment", "card");
buyerItem.saveData("address", "Petrozavodsk");
buyerItem.saveData("email", "nick762@yandex.ru");
buyerItem.saveData("phone", "");
const buyerData = buyerItem.getBuyerInfo();
console.log("Выводим данные пользователя", buyerData);
console.log("Проверяем поле payment", buyerItem.checkData("payment", buyerData.payment));
console.log("Проверяем данные поля phone", buyerItem.checkData("phone", buyerData.phone));
buyerItem.clearBuyerInfo();
console.log("Проверяем данные пользователя после очистки", buyerItem.getBuyerInfo());
console.log("Это я");

//Проверка работы методов класса ApiInterface
const productList = new ProductCatalog();    //Создаем новый чистый каталог
const api = new Api(API_URL);                //Создаем объект апишки для связи с сервером
const dataInterface = new ApiInterface(api); //Создаем интерфейс для взаимодействия с сервером
dataInterface.getProductList().then((data) => {
    productList.saveProducts(data.items);
    console.log("Получаем содержимое productList", productList.getProductList());
});
