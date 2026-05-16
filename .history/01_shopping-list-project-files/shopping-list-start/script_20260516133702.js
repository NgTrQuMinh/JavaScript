window.addEventListener('DOMContentLoaded', () => {
    const itemForm = document.querySelector('#item-form');
    const itemList = document.querySelector('#item-list');
    let Datas = [];
    Datas = JSON.parse(localStorage.getItem('data')) || [];

    const form_Input_filter = document.querySelector('.form-input-filter');
    let value_form_filter = "";

    function render() {
        let datas = [...Datas];

        if (value_form_filter !== '') {
            datas = datas.filter((value) => {
                return value.text.toLowerCase().trim().includes(value_form_filter.toLowerCase().trim());
            })
        }

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

    form_Input_filter.addEventListener('input', (e) => {
        value_form_filter = e.target.value;
        render();
    });

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
            if (form_Input_filter.value === '') {
                form_Input_filter.value = Datas[indexId].text;
            } else {
                form_Input_filter.value = '';
            }
        }
        setLocal();
        render();
    });

    const btnClear = document.querySelector('.btn-clear');
    btnClear.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Delete ALL items?')) {
            Datas = []; // Đưa mảng dữ liệu về rỗng
            clearLocal(); // Xóa sạch trong localStorage
            formInputFilter.value = ""; // Xóa bộ chữ đang lọc (nếu có)
            value_form_filter = "";
            render(); // Cập nhật lại UI lập tức mà KHÔNG cần reload trang
        }
    });

    function setLocal() {
        localStorage.setItem('data', JSON.stringify(Datas));
    }
    function clearLocal() {
        localStorage.removeItem('data');
    }
    render();
});