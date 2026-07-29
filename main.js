window.addEventListener('DOMContentLoaded', () => {
    const Form = document.querySelector('#todo-form');
    const List = document.querySelector('#todo-list');

    let Todos = JSON.parse(localStorage.getItem('datas')) || [];

    function render() {
        let data = [...Todos];
        const rawHTML = data.map(item => {
            return `
                <li class="todo-item " data-id="${item.id}">
                    <div class="todo-content">
                    <input type="checkbox">
                    <span class="todo-text ${item.completed ? 'completed' : ''}">${item.title}</span>
                    </div>
                    <button class="delete-btn">Delete</button>
                </li>
            `
        }).join("");;
        List.innerHTML = DOMPurify.sanitize(rawHTML);
    };

    Form.addEventListener('submit', (e) => {
        e.preventDefault();
        const valueForm = document.querySelector('#todo-input').value.trim();
        if (!valueForm) return;
        let dataForm = {
            id: Date.now(),
            title: valueForm,
            completed: false
        };
        Todos.push(dataForm);
        setLocal();
        render();
    });

    List.addEventListener('click', (e) => {
        const item = e.target.closest('.todo-item');
        if (!item) return;
        const itemID = item.dataset.id;
        const indexID = Todos.findIndex((item) => {
            return String(item.id) === String(itemID);
        });
        if (indexID === -1) return;
        if (e.target.classList.contains('delete-btn')) {
            Todos.splice(indexID, 1);
        }
        else if (e.target.closest('input')) {
            Todos[indexID].completed = !Todos[indexID].completed;
        }
        setLocal();
        render();
    });
    render();
    function setLocal() {
        localStorage.setItem('datas', JSON.stringify(Todos));
    }
});



