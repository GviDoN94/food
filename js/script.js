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
            number % 100 > 4 && number % 100 < 20 ?
            2 : cases[number % 10 < 5 ? number % 10 : 5]
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

    const getResource = async (url) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status ${res.status}`);
        }

        return await res.json();
    };

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    // Forms

    const messages = {
        loading: {
            text: 'Загрузка',
            link: 'img/form/spinner.svg'
        },
        success: 'Спасибо! Скоро мы свяжемся с вами.',
        failure: 'Что-то пошло не так'
    };

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
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

            const formData = new FormData(form),
                  json = JSON.stringify(Object.fromEntries(formData.entries()));
            

            postData('http://localhost:3000/requests', json)
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
    forms.forEach(form => bindPostData(form));

    // Slider

    const slider = document.querySelector('.offer__slider'),
          slidesWrapper = slider.querySelector('.offer__slider-wrapper'),
          slidesField = slidesWrapper.querySelector('.offer__slider-inner'),
          slides = slidesField.querySelectorAll('.offer__slide'),
          prevBtn = slider.querySelector('.offer__slider-prev'),
          nextBtn = slider.querySelector('.offer__slider-next'),
          currentSlide = slider.querySelector('#current'),
          totalSlide = slider.querySelector('#total'),
          dots = [],
          width = window.getComputedStyle(slidesWrapper).width;
    let slideIndex = 1,
        offset = 0;

    function addZero(el, value) {
        el.textContent = value < 10 ? `0${value}` : value;
    }

    addZero(totalSlide, slides.length);

    addZero(currentSlide, slideIndex);

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = 'transform 0.5s';
    slidesWrapper.style.overflow = 'hidden';
    slides.forEach(slide => slide.style.width = width);
    slider.style.position = 'relative';

    const indicators = document.createElement('ol');
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        indicators.append(dot);
        dots.push(dot);
    }

    function deleteNotDigits(str) {
        return +str.replace(/\D/g, '');
    }

    function moveSlide() {
        slidesField.style.transform = `translateX(-${offset}px)`;
    }

    function moveDot() {
        dots.forEach(dot => dot.style.opacity = '0.5');
        dots[slideIndex - 1].style.opacity = 1;
    }

    function sliderAction() {
        moveSlide();
        addZero(currentSlide, slideIndex);
        moveDot();
    }

    nextBtn.addEventListener('click', () => {
        if (offset === deleteNotDigits(width) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += deleteNotDigits(width);
        }

        
        if (slideIndex === slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }
        
        sliderAction();
    });

    prevBtn.addEventListener('click', () => {
        if (offset === 0) {
            offset = deleteNotDigits(width) * (slides.length - 1);
        } else {
            offset -= deleteNotDigits(width);
        }

        
        
        if (slideIndex === 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }
        
        sliderAction();
    });

    dots[slideIndex - 1].style.opacity = 1;

    dots.forEach(dot => dot.addEventListener('click', e => {
        const slideTo = e.target.getAttribute('data-slide-to');

        slideIndex = slideTo;
        offset = deleteNotDigits(width) * (slideTo - 1);

        sliderAction();
    }));

    // Calc

    const result = document.querySelector('.calculating__result span');

    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', sex);
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', ratio);
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(element => {
            element.classList.remove(activeClass);

            if (element.id === localStorage.getItem('sex')) {
                element.classList.add(activeClass);
            }

            if (element.dataset.ratio === localStorage.getItem('ratio')) {
                element.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '___';
            return;
        }

        if (sex === 'female') {
            result.textContent = Math.round(
                (447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio
            );
                
        } else {
            result.textContent = Math.round(
                (88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio
            );
        }
    }

    calcTotal();

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(element => element.addEventListener('click', e => {
            if (e.target.dataset.ratio) {
                ratio = +e.target.dataset.ratio;
                localStorage.setItem('ratio', ratio);
            } else {
                sex = e.target.id;
                localStorage.setItem('sex', sex);
            }

            elements.forEach(elem => elem.classList.remove(activeClass));
    
            e.target.classList.add(activeClass);

            calcTotal();
        }));
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInformation(parentSelector) {
        const inputs = document.querySelectorAll(`${[parentSelector]} input`);

        inputs.forEach(input => input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

            switch(input.id) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }

            calcTotal();
        }));
    }

    getDynamicInformation('.calculating__choose_medium');
});
