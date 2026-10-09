window.addEventListener('DOMContentLoaded', () => {
    const todo_form = document.querySelector('#todo-form');
    const todo_input = document.querySelector('#todo-input');
    const todo_list = document.querySelector('#todo-list');
    // Địa chỉ API giả lập để thực hành
    const API_URL = 'https://jsonplaceholder.typicode.com/todos';

    // Đọc dữ liệu đã lưu trong localStorage, nếu chưa có thì dùng mảng rỗng
    let todos = JSON.parse(localStorage.getItem('datas')) || [];

    // Lưu mảng todos vào localStorage (chuyển thành chuỗi JSON trước khi lưu)
    const setLocal = () => {
        localStorage.setItem('datas', JSON.stringify(todos));
    };

    // Lấy 5 todo đầu tiên từ API
    const getDatas = async () => {
        try {
            // Gọi API với giới hạn 5 phần tử
            const res = await fetch(`${API_URL}?_limit=5`);
            if (!res.ok) throw new Error(`Error ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    // Hàm làm sạch chuỗi bằng thư viện DOMPurify (chống XSS)
    const clean = (str) =>
        DOMPurify.sanitize(String(str), {  // String(): ép về chuỗi để không lỗi khi gặp số/null
            ALLOWED_TAGS: []               // Không cho thẻ HTML nào -> mọi thẻ bị loại bỏ, chỉ còn chữ thuần
        });

    // Template
    const todoTemplate = (item) => `
        <li class="todo-item ${item.completed ? 'completed' : ''}" data-id="${item.id}">
            <div class="todo-content">
                <input type="checkbox" ${item.completed ? 'checked' : ''}>
                <span class="todo-text">${clean(item.title)}</span>
            </div>
            <button class="delete-btn">Delete</button>
        </li>
    `;

    // Vẽ toàn bộ danh sách: mỗi todo -> 1 chuỗi HTML -> nối lại -> gán 1 lần
    const render = (data) => {
        todo_list.innerHTML = data.map(todoTemplate).join('');
    };

    // Xử lý sự kiện thêm todo mới
    todo_form.addEventListener('submit', async (e) => {
        // Chặn trình duyệt tải lại trang khi submit form
        e.preventDefault();
        // Lấy chữ người dùng nhập và cắt khoảng trắng 2 đầu
        const valueInput = todo_input.value.trim();
        // Nếu rỗng thì dừng, không làm gì
        if (!valueInput) return;

        try {
            // Gửi todo mới lên server
            const res = await fetch(API_URL, {
                method: 'POST',                                     // Phương thức thêm mới
                headers: { 'Content-Type': 'application/json' },    // Báo server: dữ liệu là JSON
                body: JSON.stringify({ title: valueInput, completed: false }) // Nội dung gửi đi
            });
            // Nếu server báo lỗi thì ném lỗi
            if (!res.ok) throw new Error(`Error ${res.status}`);
            // Đọc dữ liệu server trả về
            const data = await res.json();
            // API giả luôn trả id=201, nên tự tạo id duy nhất bằng thời gian
            data.id = Date.now();
            // Thêm vào mảng todos
            todos.push(data);
            // Lưu lại vào localStorage
            setLocal();
            // Chèn đúng 1 phần tử mới vào cuối list, không vẽ lại cả danh sách
            todo_list.insertAdjacentHTML('beforeend', todoTemplate(data));
            // Xóa chữ trong ô nhập
            todo_input.value = '';
        } catch (error) {
            // In lỗi ra console
            console.error(error);
        }
    });

    // Event delegation: 1 listener duy nhất cho cả danh sách (xóa + tick)
    todo_list.addEventListener('click', async (e) => {
        const item = e.target.closest('.todo-item');
        if (!item) return;
        const itemID = item.dataset.id;

        // Tìm vị trí todo trong mảng (so sánh dạng chuỗi cho chắc)
        const indexID = todos.findIndex((t) => String(t.id) === String(itemID));
        if (indexID === -1) return;

        // Trường hợp 1: bấm nút Delete
        if (e.target.classList.contains('delete-btn')) {
            try {
                // Gọi API xóa theo id
                const res = await fetch(`${API_URL}/${itemID}`,
                    { method: 'DELETE' });

                if (!res.ok) throw new Error(`Error ${res.status}`);

                todos.splice(indexID, 1);
                setLocal();
                item.remove();
            } catch (error) {
                console.error(error);
            }
        }
        // Trường hợp 2: bấm checkbox
        else if (e.target.matches('input[type="checkbox"]')) {
            const newStatus = !todos[indexID].completed;
            try {
                // Gọi API cập nhật trạng thái
                const res = await fetch(`${API_URL}/${itemID}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ completed: newStatus })      // Trạng thái mới
                });

                if (!res.ok) throw new Error(`Error ${res.status}`);

                todos[indexID].completed = newStatus;
                setLocal();
                item.classList.toggle('completed', newStatus);
            } catch (error) {
                console.error(error);
                e.target.checked = todos[indexID].completed;
            }
        }
    });

    // Hàm khởi động app
    const startApp = async () => {
        if (todos.length === 0) {
            todos = await getDatas();
            setLocal();
        }
        render(todos);
    };

    startApp();
});