 document.addEventListener("DOMContentLoaded", () => {
     'use strict';

     //Константы
     const customer = document.getElementById("customer"),
         freelancer = document.getElementById("freelancer"),
         blockCustomer = document.getElementById("block-customer"),
         blockFreelance = document.getElementById("block-freelancer"),
         blockChoise = document.getElementById("block-choice"),
         btnExit = document.getElementById("btn-exit"),
         formCustomer = document.getElementById("form-customer"),
         orders = JSON.parse(localStorage.getItem("freeOrders")) || [], // Законспектировать
         ordersTable = document.getElementById("orders"),
         modalOrder = document.getElementById("order_read"),
         modalOrderActive = document.getElementById("order_active");

     //Функции
     const handlerModal = (event) => {
         const target = event.target;
         const modal = target.closest(".order-modal");
         const order = orders[modal.id];
         const modalBaseAction = function () {
             modal.style.display = "none";
             renderOrders();
             toStorage();

         };

         //Закрытие модалки
         if (target.closest('.close') || target === modal) {
             modalBaseAction();
         }

         //Взять заказ
         if (target.classList.contains("get-order")) {
             order.active = true;
             order.classList.remove("table-warning");
             order.classList.remove("table-danger");
             modalBaseAction();
         }

         //Откзаться от заказа
         if (target.id === "capitulation") {
             order.active = false;
             modalBaseAction();
         }

         //Заказ выполнен
         if (target.id === "ready") {
             orders.splice(modal.id, 1);
             modalBaseAction();
         }
     };

     const openModal = (numberOrder) => {
         const order = orders[numberOrder];
         //Диструктивное присваивание
         const {
             title,
             firstName,
             email,
             phone,
             description,
             amount,
             currency,
             deadline,
             active
         } = order;
         //Законспектировать
         const modal = active ? modalOrderActive : modalOrder;

         modal.id = numberOrder;

         //Вешаем окна на константы
         const modalTitleBlock = modal.querySelector(".modal-title");
         const firstNameBlock = modal.querySelector(".firstName");
         const emailBlock = modal.querySelector(".email");
         const deadlineBlock = modal.querySelector(".deadline");
         const descriptionBlock = modal.querySelector(".description");
         const countBlock = modal.querySelector(".count");
         const countImgBlock = modal.querySelector(".currency_img");
         const phoneBlock = modal.querySelector(".phone");
         //Заполняем окна
         modalTitleBlock.textContent = title;
         firstNameBlock.textContent = firstName;
         emailBlock.href = "mailto: " + email;
         emailBlock.textContent = email;
         deadlineBlock.textContent = deadline;
         descriptionBlock.textContent = description;
         countBlock.textContent = amount;
         countImgBlock.className = "currency_img";
         countImgBlock.classList.add(currency);
         if (phoneBlock) phoneBlock.href = 'tel: ' + phone;
         //Записать как работает href у mailto и tel
         modal.style.display = "flex";
         modal.addEventListener("click", handlerModal);
     };

     const toStorage = () => {
         localStorage.setItem("freeOrders", JSON.stringify(orders));
     };

     const delOfNum = function declOfNum(number, titles) {
         const cases = [2, 0, 1, 1, 1, 2];
         return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
     };

     //Мое решение отображения дедлайна
     const calcDeadline = (deadline) => {
         const now = Date.now();
         const milDeadline = Date.parse(new Date(
             +(deadline[0] + deadline[1] + deadline[2] + deadline[3]),
             (+(deadline[5] + deadline[6])) - 1,
             +(deadline[8] + deadline[9])
         ));
         
         const result = Math.ceil((milDeadline - now) / 1000 / 60 / 60);
         const resultDay = Math.ceil((milDeadline - now) / 1000 / 60 / 60 / 24);

         if (result >= 24) {
             return (resultDay) + " " + delOfNum(resultDay, ["день", "дня", "дней"]);
         } else if (result < 0) {
             return "Срок истек!";
         } else if (result > 0 && result < 24) {
             return result + " " + delOfNum(result, ["час", "часа", "часов"]);
         }
     };

     //Решение отображения дедлайна с воркшопа
     const calcDeadlineGlo = (data) => {
         const deadline = new Date(data); //Основная разница в том, что необязательно возиться с параметром data для перевода его в миллисекунды, т.к. преобразование через new Data() изначально имеет формат милисекунд, но выводится в консоль с методом toString();
         const toDay = Date.now();

         const remaining = (deadline - toDay) / 1000 / 60 / 60;

         return delOfNum(Math.floor(remaining / 24), ["день", "дня", "дней"]);
     };

     const renderOrders = () => {
         ordersTable.textContent = "";
         orders.forEach((orders, i) => {
             const deadline = calcDeadline(orders.deadline);
             //Добавление заказов в таблицу
             ordersTable.innerHTML += ` 
                <tr class="order ${orders.active ? 'taken' : ''}" data-number-order="${i}">
                    <td>${i+1}</td>
                    <td>${orders.title}</td>
                    <td class="${orders.currency}"></td>
                    <td>${deadline}</td>
                </tr>
            `;
         });
     };

     //Обработчики событий
     ordersTable.addEventListener("click", (event) => {
         const target = event.target.closest(".order");

         if (target) {
             openModal(target.dataset.numberOrder);
         }
     });

     customer.addEventListener("click", () => {
         const toDay = new Date().toISOString().substring(0, 10); //Записать про Date
         document.querySelector("#deadline").min = toDay;
         document.querySelector("#deadline").value = toDay;
         blockCustomer.style.display = "block";
         blockChoise.style.display = "none";
         btnExit.style.display = "block";
     });

     freelancer.addEventListener("click", () => {
         blockFreelance.style.display = "block";
         renderOrders();
         blockChoise.style.display = "none";
         btnExit.style.display = "block";
     });

     btnExit.addEventListener("click", () => {
         btnExit.style.display = "none";
         blockFreelance.style.display = "none";
         blockCustomer.style.display = "none";
         blockChoise.style.display = "block";
     });

     formCustomer.addEventListener("submit", (event) => {
         //Отмену дефолтных действий (перезагрузка) для формы
         event.preventDefault();
         const objFormCustomer = {};
         [...formCustomer.elements].forEach((elem) => {
             if (elem.tagName === "INPUT" && elem.type != "radio" ||
                 elem.type === "radio" && elem.checked ||
                 elem.tagName === "TEXTAREA") { //Необходимо проверять свойство cheked у radio
                 objFormCustomer[elem.name] = elem.value;
             }
         });
         orders.push(objFormCustomer);
         formCustomer.reset();
         toStorage();
         //Законспектировать работу с localstorage
     });
 });