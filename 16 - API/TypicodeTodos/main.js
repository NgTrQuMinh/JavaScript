window.addEventListener('DOMContentLoaded', () => {
    const todo_form = document.querySelector('#todo-form');
    const loading = document.querySelector('#loading');
    const todo_list = document.querySelector('#todo-list');
    const API_URL = 'https://jsonplaceholder.typicode.com/todos';

    let todos = [];
    todos = JSON.parse(localStorage.getItem('datas')) || [];

    const getDatas = async () => {
        try {
            const res = await fetch(API_URL + `?_limit=5`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) {
                throw new Error(`Error ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error(error);
            return []; // Trả về mảng rỗng để app không bị sập nếu API lỗi
        }
    }

    // Hàm tạo phần tử DOM độc lập giúp bảo mật XSS và dễ quản lý
    function createTodoItemElement(item) {
        const li = document.createElement('li');
        li.className = `todo-item ${item.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', item.id);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'todo-content';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.completed;

        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = item.title; // CHỐNG XSS: Mã độc dạng chữ sẽ không thể thực thi

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';

        contentDiv.appendChild(checkbox);
        contentDiv.appendChild(span);
        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);

        return li;
    }

    function render(data) {
        todo_list.innerHTML = ''; // Chỉ xóa sạch một lần duy nhất trước khi vẽ
        const fragment = document.createDocumentFragment(); // Tối ưu hiệu năng ghi DOM

        data.forEach(item => {
            const todoEl = createTodoItemElement(item);
            fragment.appendChild(todoEl);
        });

        todo_list.appendChild(fragment);
    };

    todo_form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const todo_input = document.querySelector('#todo-input'); // Lấy ô input
        const valueInput = todo_input.value.trim();
        if (!valueInput) return;
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: valueInput,
                    completed: false
                })
            });
            const data = await res.json();
            data.id = Date.now();
            todos.push(data);
            setLocal();

            // TỐI ƯU: Chỉ chèn thêm đúng phần tử mới vào cuối UI, không vẽ lại cả mảng
            const newTodoEl = createTodoItemElement(data);
            todo_list.appendChild(newTodoEl);

            todo_input.value = ''; // Xóa chữ trong ô nhập cho sạch giao diện
        } catch (error) {
            console.error(error);
        }
    });

    todo_list.addEventListener('click', async (e) => {
        const item = e.target.closest('.todo-item');
        if (!item) return;
        const itemID = item.dataset.id;
        const indexID = todos.findIndex((e) => {
            return String(e.id) === String(itemID);
        });
        if (indexID === -1) return;

        if (e.target.classList.contains('delete-btn')) {
            try {
                // CHUẨN ĐI LÀM: Truyền itemID lên URL để xóa đúng dữ liệu trên Server
                const res = await fetch(`${API_URL}/${itemID}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });
                todos.splice(indexID, 1);
                setLocal();

                // TỐI ƯU: Xóa trực tiếp element này khỏi màn hình
                item.remove();
            } catch (error) {
                console.error(error);
            }
        } else if (e.target.closest('input[type="checkbox"]')) {
            try {
                const currentStatus = todos[indexID].completed;
                // CHUẨN ĐI LÀM: Truyền itemID lên URL để cập nhật trên Server
                const res = await fetch(`${API_URL}/${itemID}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ completed: !currentStatus })
                });

                todos[indexID].completed = !currentStatus;
                setLocal();

                // TỐI ƯU: Chỉ bật/tắt class completed ngay tại phần tử đó
                item.classList.toggle('completed', todos[indexID].completed);
            } catch (error) {
                console.error(error);
                e.target.checked = todos[indexID].completed; // Reset lại UI nếu API lỗi
            }
        }
    });

    const starApp = async () => {
        if (todos.length === 0) {
            todos = await getDatas();
            setLocal();
        }
        render(todos);
    }
    starApp();

    function setLocal() {
        localStorage.setItem('datas', JSON.stringify(todos));
    }
});