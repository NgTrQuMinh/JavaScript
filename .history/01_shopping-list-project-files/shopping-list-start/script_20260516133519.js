window.addEventListener('DOMContentLoaded', () => {
    // 1. Khởi tạo và DOM Elements
    const itemForm = document.querySelector('#item-form');
    const formInput = document.querySelector('.form-input');
    const itemList = document.querySelector('#item-list');
    const formInputFilter = document.querySelector('.form-input-filter');
    const btnClear = document.querySelector('.btn-clear');
    const filterContainer = document.querySelector('#filter-container');

    // Lấy dữ liệu từ localStorage, nếu không có thì gán mảng rỗng
    let Datas = JSON.parse(localStorage.getItem('data')) || [];
    let value_form_filter = "";

    // 2. Hàm Render chính (Đồng bộ Dữ liệu -> Giao diện)
    function render() {
        // Sao chép mảng gốc để xử lý bộ lọc (không làm mất dữ liệu gốc)
        let datasToRender = [...Datas];

        // Ẩn/Hiện bộ lọc và nút Clear All dựa trên số lượng phần tử gốc
        if (Datas.length === 0) {
            filterContainer.classList.add('hidden');
            btnClear.classList.add('hidden');
        } else {
            filterContainer.classList.remove('hidden');
            btnClear.classList.remove('hidden');
        }

        // Thực hiện lọc dữ liệu nếu người dùng có nhập vào ô tìm kiếm
        if (value_form_filter.trim() !== '') {
            datasToRender = datasToRender.filter((value) => {
                return value.text.toLowerCase().trim().includes(value_form_filter.toLowerCase().trim());
            });
        }

        // Vẽ lại cây DOM dựa trên mảng dữ liệu đã xử lý
        itemList.innerHTML = datasToRender.map((value) => {
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

    // 3. Sự kiện Lọc dữ liệu (Filter)
    formInputFilter.addEventListener('input', (e) => {
        value_form_filter = e.target.value;
        render(); // Chạy lại render để cập nhật danh sách lọc
    });

    // 4. Sự kiện Thêm phần tử mới (Submit Form)
    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const textValue = formInput.value.trim();

        if (textValue === '') return;

        // Đẩy object mới vào mảng dữ liệu
        Datas.push({
            id: Date.now(), // Tạo id duy nhất bằng timestamp
            text: textValue,
            checked: false
        });

        setLocal(); // Cập nhật localStorage
        render();   // Render lại giao diện
        itemForm.reset(); // Xóa sạch chữ trong ô input thêm
    });

    // 5. Sự kiện Click vào Danh sách (Xóa hoặc Đánh dấu Hoàn thành)
    itemList.addEventListener('click', (e) => {
        const itemLi = e.target.closest('.item');
        if (!itemLi) return; // Nếu click trượt ra ngoài thẻ li thì dừng lại

        const idItem = Number(itemLi.dataset.id);
        const indexId = Datas.findIndex((value) => value.id === idItem);

        if (indexId === -1) return;

        // Trường hợp 5.1: Click vào nút Xóa (remove-item)
        if (e.target.closest('.remove-item')) {
            if (confirm('Are you sure you want to delete this item?')) {
                Datas.splice(indexId, 1); // Xóa phần tử khỏi mảng dữ liệu
            } else {
                return; // Nếu bấm hủy confirm thì giữ nguyên
            }
        }

        // Trường hợp 5.2: Click vào chữ (item-name) -> Đánh dấu hoàn thành (Toggle Checked)
        if (e.target.closest('.item-name')) {
            Datas[indexId].checked = !Datas[indexId].checked; // Đảo trạng thái true <-> false
        }

        setLocal(); // Cập nhật localStorage sau khi thay đổi dữ liệu
        render();   // Vẽ lại giao diện mới
    });

    // 6. Sự kiện Xóa toàn bộ danh sách (Clear All)
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

    // 7. Các hàm bổ trợ tương tác với LocalStorage
    function setLocal() {
        localStorage.setItem('data', JSON.stringify(Datas));
    }

    function clearLocal() {
        localStorage.removeItem('data'); // Sửa lại: Dùng removeItem thay vì clear() vô điều kiện
    }

    // Chạy render lần đầu tiên khi tải xong trang để load dữ liệu cũ lên
    render();
});