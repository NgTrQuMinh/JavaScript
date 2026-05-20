window.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://jsonplaceholder.typicode.com/todos';
    const todoList = document.querySelector('#todo-list');
    const todoForm = document.querySelector('#todo-form');

    let localTodos = [];    // "bộ nhớ tạm" (State) trung tam luu tru data

    // 1. Hàm lấy dữ liệu từ API
    const getData = async () => {
        try {
            const response = await fetch(`${API_URL}?_limit=5`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`Lỗi: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Lỗi lấy dữ liệu:', error);
            return []; // Trả về mảng rỗng nếu lỗi để ứng dụng không bị sập
        }
    }

    // 2. Hàm hiển thị danh sách ra màn hình
    function render(todos) {
        todoList.innerHTML = todos.map((item) => {
            return `
            <li class="todo-item" data-id="${item.id}">
                <div class="todo-content ${item.completed ? 'completed' : ''}">
                    <input type="checkbox" ${item.completed ? 'checked' : ''}>
                    <span class="todo-text">${item.title}</span>
                </div>
                <button class="delete-btn">Delete</button>
            </li>
            `;
        }).join('');
    };

    // 3. Sự kiện thêm một Todo mới
    todoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const todoInput = document.querySelector('#todo-input');
        const todoText = todoInput.value.trim();
        if (!todoText) return;

        try {
            const response = await fetch(API_URL, { // Gửi tới API_URL gốc
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: todoText,
                    completed: false,
                }),
            });
            if (!response.ok) throw new Error(`Lỗi: ${response.status}`);

            const newTodo = await response.json();
            newTodo.id = Date.now(); // Id newTodo

            localTodos.push(newTodo);
            render(localTodos);
            todoInput.value = ''; // Reset ô nhập
        } catch (error) {
            console.error('Lỗi thêm dữ liệu:', error);
        }
    });

    // 4. Sự kiện Xóa và Cập nhật trạng thái Todo
    todoList.addEventListener('click', async (e) => {
        const item = e.target.closest('.todo-item');
        if (!item) return;
        const todoId = item.dataset.id;
        const todoItem = localTodos.findIndex(value => String(value.id) === String(todoId));
        if (todoItem === -1) return;

        // TÁC VỤ 1: XÓA TODO
        if (e.target.classList.contains('delete-btn')) {
            try {
                const response = await fetch(`${API_URL}/${todoId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error(`Lỗi: ${response.status}`);

                localTodos.splice(todoItem, 1);
            } catch (error) {
                console.error('Lỗi xóa dữ liệu:', error);
            }
        }

        // TÁC VỤ 2: CLICK CHECKBOX
        if (e.target.closest('input[type="checkbox"]')) {
            const currentStatus = localTodos[todoItem].completed;

            try {
                const response = await fetch(`${API_URL}/${todoId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        completed: !currentStatus,
                    }),
                });
                if (!response.ok && todoId <= 200) throw new Error(`Lỗi: ${response.status}`);

                localTodos[todoItem].completed = !currentStatus;
            } catch (error) {
                console.error('Lỗi cập nhật trạng thái:', error);
            }
        }

        // Giữ nguyên phong cách của bạn: Luôn chạy render lại sau khi kết thúc click xử lý dữ liệu xong
        render(localTodos);
    });

    const startApp = async () => {
        localTodos = await getData(); // Gán dữ liệu lấy về vào mảng local
        render(localTodos);
    }
    startApp();
});