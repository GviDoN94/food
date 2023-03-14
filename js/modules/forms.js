'use strict';

function forms() {
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
}

export default forms;
