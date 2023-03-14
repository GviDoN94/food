'use strict';

function slider({container, wrapper, field, slide, nextArrow, prevArrow, currentCounter, totalCounter}) {
    const slider = document.querySelector(container),
    slidesWrapper = slider.querySelector(wrapper),
    slidesField = slidesWrapper.querySelector(field),
    slides = slidesField.querySelectorAll(slide),
    prevBtn = slider.querySelector(prevArrow),
    nextBtn = slider.querySelector(nextArrow),
    currentSlide = slider.querySelector(currentCounter),
    totalSlide = slider.querySelector(totalCounter),
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
}

export default slider;
