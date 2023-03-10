'use strict';

function timer(id, deadline) {

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
                "????????",
                "??????",
                "????????",
            ]);
            hoursText.lastChild.textContent = declOfNum(timeLeft.hours, [
                "??????",
                "????????",
                "??????????",
            ]);
            minutesText.lastChild.textContent = declOfNum(timeLeft.minutes, [
                "????????????",
                "????????????",
                "??????????",
            ]);
            secondsText.lastChild.textContent = declOfNum(timeLeft.seconds, [
                "??????????????",
                "??????????????",
                "????????????",
            ]);

            if (timeLeft.total <= 0) {
                clearInterval(timerInterval);
            }
        }
    }

    setClock(id, deadline);
}

export default timer;
