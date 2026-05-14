window.addEventListener('DOMContentLoaded', () => {
    const itemForm = document.querySelector('#item-form');
    const itemList = document.querySelector('#item-list');
    let Datas = [];
    Datas = JSON.parse(localStorage.getItem('data')) || [];

    function render() {
        let datas = [...Datas];

        itemList.innerHTML = datas.map((value) => {
            return `
                <li class="item" data-id="${value.id}">
                    <span class="item-name ${value.checked ? 'checked' : ''}">${value.text}</span>
                    <button class="remove-item btn-link text-red">
                    <i class="fa-solid fa-xmark"></i>
                    </button>
                </li>
            `;
        }).join('');
    }

    const formInput = document.querySelector('.form-input');
    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (formInput.value === '') return;
        Datas.push({
            id: Date.now(),
            text: formInput.value,
            checked: false
        });
        setLocal();
        render();
        itemForm.reset();
    });

    const form_Input_filter = document.querySelector('.form-input-filter'); 


    itemList.addEventListener('click', (e) => {
        const item = e.target.closest('.item');
        if (!item) return;
        let idItem = item.dataset.id;
        let indexId = Datas.findIndex((value) => {
            return value.id === Number(idItem);
        });
        if (e.target.closest('.remove-item')) {
            Datas.splice(indexId, 1);
        }
        if (e.target.closest('.item-name')) {
            Datas[indexId].checked = !Datas[indexId].checked;
            form_Input_filter.value = Datas[indexId].text;
        }
        setLocal();
        render();
    });

    function setLocal() {
        localStorage.setItem('data', JSON.stringify(Datas));
    }
    render();
});