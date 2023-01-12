"use strict";

window.addEventListener("DOMContentLoaded", () => {

    // Tabs

    const tabs = document.querySelectorAll(".tabheader__item"),
    tabsContent = document.querySelectorAll(".tabcontent"),
    tabsParent = document.querySelector(".tabheader__items");

    const hideTabContent = function () {
        tabsContent.forEach((item) => {
        item.classList.add("hide");
        item.classList.remove("show", "fade");
        });

        tabs.forEach((tab) => {
            tab.classList.remove("tabheader__item_active");
        });
    };

    const showTabContent = function (i = 0) {
        tabsContent[i].classList.add("show", "fade");
        tabsContent[i].classList.remove("hide");
        tabs[i].classList.add("tabheader__item_active");
    };

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener("click", (e) => {
        const target = e.target;
        if (target && target.classList.contains("tabheader__item")) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadline = "2023-05-20T00:00:00.000+03:00";

    function getTimerRemaind(endTime) {
        const total = Date.parse(endTime) - Date.parse(new Date());
        let days = 0,
            hours = 0,
            minutes = 0,
            seconds = 0;

        if (total > 0) {
            days = Math.floor(total / (1000 * 60 * 60 * 24));
            hours = Math.floor((total / (1000 * 60 * 60)) % 24);
            minutes = Math.floor((total / 1000 / 60) % 60);
            seconds = Math.floor((total / 1000) % 60);
        }

        return {
            total,
            days,
            hours,
            minutes,
            seconds,
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        }
        return num;
    }

    function declOfNum(number, titles) {
        const cases = [2, 0, 1, 1, 1, 2];
        return titles[
            number % 100 > 4 && number % 100 < 20
            ? 2
            : cases[number % 10 < 5 ? number % 10 : 5]
        ];
    }

    function setClock(selector, endTime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector("#days"),
              hours = timer.querySelector("#hours"),
              minutes = timer.querySelector("#minutes"),
              seconds = timer.querySelector("#seconds"),
              daysText = days.closest(".timer__block"),
              hoursText = hours.closest(".timer__block"),
              minutesText = minutes.closest(".timer__block"),
              secondsText = seconds.closest(".timer__block"),
              timerInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const timeLeft = getTimerRemaind(endTime);

            days.textContent = getZero(timeLeft.days);
            hours.textContent = getZero(timeLeft.hours);
            minutes.textContent = getZero(timeLeft.minutes);
            seconds.textContent = getZero(timeLeft.seconds);
            daysText.lastChild.textContent = declOfNum(timeLeft.days, [
                "День",
                "Дня",
                "Дней",
            ]);
            hoursText.lastChild.textContent = declOfNum(timeLeft.hours, [
                "Час",
                "Часа",
                "Часов",
            ]);
            minutesText.lastChild.textContent = declOfNum(timeLeft.minutes, [
                "Минута",
                "Минуты",
                "Минут",
            ]);
            secondsText.lastChild.textContent = declOfNum(timeLeft.seconds, [
                "Секунда",
                "Секунды",
                "Секунд",
            ]);

            if (timeLeft.total <= 0) {
                clearInterval(timerInterval);
            }
        }
    }

    setClock(".timer", deadline);

    // Modal

    const modal = document.querySelector('.modal'),
          modalOpenBtns = document.querySelectorAll('[data-modal]');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
    }

    modalOpenBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            openModal();
            clearInterval(modalTimerId);
        });
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-modal-close') === '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 10000);

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
            clearInterval(modalTimerId);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // classes for cards

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.priceToRuble();
            this.parent = document.querySelector(parentSelector);
        }

        priceToRuble() {
            this.price = this.price * 72;
        }

        render() {
            const card = document.createElement('div');
            if (this.classes.length) {
                this.classes
                    .forEach(className => card.classList.add(className));
            } else {
                this.classes = 'menu__item';
                card.classList.add(this.classes);
            }

            card.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total">
                        <span>${this.price}</span> руб/день
                    </div>
                </div>
            `;
            this.parent.append(card);
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        `Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих
        овощей и фруктов. Продукт активных и здоровых людей. Это абсолютноновый
        продукт с оптимальной ценой и высоким качеством!`,
        11,
        '.menu .container',
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        `В&nbsp;меню &laquo;Премиум&raquo; мы&nbsp;используем не&nbsp;только
        красивый дизайн упаковки, но&nbsp;и&nbsp;качественное исполнение блюд.
        Красная рыба, морепродукты, фрукты&nbsp;&mdash; ресторанное меню без
        похода в&nbsp;ресторан!`,
        15,
        '.menu .container',
        'menu__item',
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        `Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие
        продуктов животного происхождения,молоко из миндаля, овса, кокоса
        или гречки, правильное количество белков за счет тофу и импортных
        вегетарианских стейков.`,
        9,
        '.menu .container',
        'menu__item',
    ).render();

    // Forms

    const messages = {
        loading: {
            text: 'Загрузка',
            link: 'img/form/spinner.svg'
        },
        success: 'Спасибо! Скоро мы свяжемся с вами.',
        failure: 'Что-то пошло не так'
    };

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const loading = document.createElement('img');
            loading.src = messages.loading.link;
            loading.alt = messages.loading.text;
            loading.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', loading);

            const formData = new FormData(form);

            const object = {};

            formData.forEach((value, key) => {
                object[key] = value;
            });
            
            fetch('server.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(object)
            })
            .then(data => data.text())
            .then((data => {
                console.log(data);
                showThanksModal(messages.success);
                loading.remove();
            }))
            .catch(() => showThanksModal(messages.failure))
            .finally(() => form.reset());
        });
    }

    function showThanksModal(message) {
        const previewModalDialog = modal.querySelector('.modal__dialog');

        previewModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-modal-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        modal.append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            previewModalDialog.classList.add('show');
            previewModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    const forms = document.querySelectorAll('form');
    forms.forEach(form => postData(form));
});

const funds = [
    {amount: -1400},
    {amount: 2400},
    {amount: -1000},
    {amount: 500},
    {amount: 10400},
    {amount: -11400}
];

const getPositiveIncomeAmount = (data) => {
    return data
        .filter(item => item.amount > 0)
        .map(item => item.amount)
        .reduce((a, b) => a + b);
};

console.log(getPositiveIncomeAmount(funds));

const getTotalIncomeAmount = (data) => {
    if(data.some(item => item.amount < 0)) {
        return data.map(item => item.amount)
            .reduce((a, b) => a + b);
    }   else {
        return getPositiveIncomeAmount(data);
    }
};

console.log(getTotalIncomeAmount(funds));