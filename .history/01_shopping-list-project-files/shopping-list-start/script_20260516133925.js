window.addEventListener('DOMContentLoaded', () => {
    // 1. Khai báo các phần tử DOM
    const itemForm = document.querySelector('#item-form');
    const formInput = document.querySelector('.form-input'); // Di chuyển lên đầu để dễ quản lý
    const itemList = document.querySelector('#item-list');
    const formInputFilter = document.querySelector('.form-input-filter');
    const btnClear = document.querySelector('.btn-clear');

    // 2. Quản lý trạng thái Dữ liệu (State)
    let Datas = [];
    Datas = JSON.parse(localStorage.getItem('data')) || [];
    let value_form_filter = "";

    // 3. Hàm Render chính - Đồng bộ Dữ liệu -> Giao diện
    function render() {
        let datas = [...Datas];

        // Lọc dữ liệu nếu người dùng nhập tìm kiếm
        if (value_form_filter !== '') {
            datas = datas.filter((value) => {
                return value.text.toLowerCase().trim().includes(value_form_filter.toLowerCase().trim());
            });
        }

        // Tạo chuỗi HTML và chèn vào DOM
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

    // 4. Sự kiện nhập ô bộ lọc (Filter Input)
    formInputFilter.addEventListener('input', (e) => {
        value_form_filter = e.target.value;
        render();
    });

    // 5. Sự kiện thêm Item mới (Submit Form)
    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputValue = formInput.value.trim();
        if (inputValue === '') return; // Chống thêm item rỗng hoặc toàn dấu cách

        Datas.push({
            id: Date.now(),
            text: inputValue,
            checked: false
        });

        setLocal();
        render();
        itemForm.reset();
    });

    // 6. Sự kiện Click trên danh sách (Xóa hoặc Đổi trạng thái hoàn thành)
    itemList.addEventListener('click', (e) => {
        const item = e.target.closest('.item');
        if (!item) return;

        let idItem = item.dataset.id;
        let indexId = Datas.findIndex((value) => {
            return value.id === Number(idItem);
        });

        if (indexId === -1) return;

        // Xử lý khi nhấn nút Xóa
        if (e.target.closest('.remove-item')) {
            Datas.splice(indexId, 1);
        }

        // ĐÃ SỬA: Xử lý khi nhấn vào tên Item (Chỉ đảo ngược trạng thái checked)
        if (e.target.closest('.item-name')) {
            Datas[indexId].checked = !Datas[indexId].checked;
        }

        setLocal();
        render();
    });

    // 7. Sự kiện Xóa sạch danh sách (Clear All)
    btnClear.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Delete ALL items?')) {
            Datas = [];
            clearLocal();
            formInputFilter.value = "";
            value_form_filter = "";
            render(); // Giao diện tự động cập nhật trống mà không cần reload trang
        }
    });

    // 8. Các hàm tương tác với LocalStorage
    function setLocal() {
        localStorage.setItem('data', JSON.stringify(Datas));
    }

    function clearLocal() {
        localStorage.removeItem('data');
    }

    // Chạy render lần đầu khi load trang
    render();
});