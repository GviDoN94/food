'use strict';

import { getResource } from "../services/services";

function cards() {
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

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });
}

export default cards;
