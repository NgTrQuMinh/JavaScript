window.addEventListener("load", function () {
    const todoList = document.querySelector(".todo-list");
    let TodoLists = []; // Lưu trữ dữ liệu

    // B3: Lưu Trữ localStorage
    // Nêu localStorage có lưu giá trị vào key thì giải mã rồi lấy nó ra
    TodoLists = localStorage.length > 0 ? JSON.parse(localStorage.getItem("TodoLists")) : [];
    if (Array.isArray(TodoLists) && TodoLists.length > 0) {
        TodoLists.forEach(item => {
            createTodoItem(item);
        });
    }

    // B2: Input ra màn hình 
    function createTodoItem(title) {
        const Template =
            `<div class="todo-item">
                <span class="todo-text">${title}</span>
                <button class="todo-remove">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>`;
        todoList.insertAdjacentHTML("beforeend", Template);
    }

    // B1: Chuyển hóa dữ liệu từ Form
    const form = document.querySelector(".todo-form");
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const fromData = new FormData(form);    // Tạo fromData để lưu các Input vào.
        const Data = Object.fromEntries(fromData.entries()); // Chuyển đổi fromData sang dạng Object.

        createTodoItem(Data.todoValue); // truy xuất dữ liệu

        // Lưu trữ data vào 1 Arr và chuyển vào localStorage.
        TodoLists.push(Data.todoValue);
        localStorage && localStorage.setItem("TodoLists", JSON.stringify(TodoLists));

        form.reset();   // Xóa bỏ Input khi nhấn submit.
    })

    // B4: Delete 
    todoList.addEventListener("click", function (e) {
        const removeBtn = e.target.closest(".todo-remove");
        if (removeBtn) {
            e.preventDefault();

            // 1. Xác định phần tử cha (todo-item) để xóa khỏi giao diện
            const todoItem = removeBtn.parentElement;
            todoItem.remove();  // xóa giao diên.

            // 2. Lấy nội dung text để tìm vị trí trong mảng
            const todoText = todoItem.querySelector(".todo-text").textContent;

            // 3. Cập nhật mảng TodoLists
            // Lọc bỏ phần tử có nội dung trùng với todoText
            TodoLists = TodoLists.filter((item) => item !== todoText);

            // 4. Lưu lại mảng mới vào localStorage để đồng bộ
            localStorage.setItem("TodoLists", JSON.stringify(TodoLists));

            console.log("Danh sách sau khi xóa:", TodoLists);
        }
    });
})



