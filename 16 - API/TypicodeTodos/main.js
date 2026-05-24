window.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://jsonplaceholder.typicode.com/todos';
    const todoList = document.querySelector('#todo-list');
    const todoForm = document.querySelector('#todo-form');
    const loadingEl = document.querySelector('#loading');

    let Todos = [];
    Todos = JSON.parse(localStorage.getItem('datas')) || [];

    const getDatas = async () => {
        try {
            const response = await fetch(API_URL + `?_limit=5`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                throw new Error(`Lỗi: ${response.status}`);
            }
            const datas = await response.json();
            return datas;
        } catch (error) {
            console.error(error);
            return [];
        } finally {
            // Ẩn thông báo Loading bất kể thành công hay thất bại
            if (loadingEl) loadingEl.style.display = 'none';
        }
    }

    function render(data) {
        todoList.innerHTML = data.map((item) => {
            return `
                <li class="todo-item ${item.completed ? 'completed' : ''}" data-id="${item.id}">
                    <div class="todo-content">
                        <input type="checkbox" ${item.completed ? 'checked' : ''}>
                        <span class="todo-text">${item.title}</span>
                    </div>
                    <button class="delete-btn">Delete</button>
                </li>
            `
        }).join('');
    }

    todoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputValue = document.getElementById('todo-input').value.trim();
        if (!inputValue) return;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: inputValue,
                    completed: false
                }),
            });
            const data = await response.json();

            data.id = Date.now();

            Todos.push(data);
            setLocal();
            render(Todos);
        } catch (error) {
            console.error(error);
        }
        todoForm.reset();
    });

    todoList.addEventListener('click', async (e) => {
        const item = e.target.closest('.todo-item');
        if (!item) return;
        const itemID = item.dataset.id;
        const indexID = Todos.findIndex((t) => String(t.id) === String(itemID));

        if (indexID === -1) return;

        // XỬ LÝ XÓA
        if (e.target.classList.contains('delete-btn')) {
            try {
                if (Number(itemID) <= 200) {
                    await fetch(API_URL + `/${itemID}`, { method: 'DELETE' });
                }
                Todos.splice(indexID, 1);
            } catch (error) {
                console.error(error);
            }
        }

        // XỬ LÝ CHECKBOX
        else if (e.target.closest('input[type="checkbox"]')) {
            const currentStatus = Todos[indexID].completed;
            try {
                if (Number(itemID) <= 200) {
                    await fetch(API_URL + `/${itemID}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ completed: !currentStatus }),
                    });
                }
                Todos[indexID].completed = !currentStatus; // Cập nhật trạng thái local
            } catch (error) {
                console.error(error);
            }
        }

        setLocal();
        render(Todos);
    });

    const starApp = async () => {
        // Nếu localStorage trống thì mới fetch từ API về
        if (Todos.length === 0) {
            Todos = await getDatas();
            setLocal();
        }
        render(Todos);
    }
    function setLocal() {
        localStorage.setItem('datas', JSON.stringify(Todos));
    }
    starApp();
});