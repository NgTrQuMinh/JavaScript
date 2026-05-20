window.addEventListener('DOMContentLoaded', () => {
    const API_URL = "https://icanhazdadjoke.com/";
    const container = document.querySelector(".Random");

    function render() {
        container.innerHTML = `
            <h1 class="title">Đang tải câu đùa đầu tiên...</h1>
            <button class="btn" disabled>Random</button>
        `;
    }
    render();

    const title = container.querySelector(".title");
    const btnRandom = container.querySelector(".btn");

    const getPosts = async () => {
        try {
            btnRandom.disabled = true;
            title.textContent = "Đang tìm câu đùa mới...";
            title.classList.add("loading");

            const response = await fetch(API_URL, {
                headers: { "Accept": "application/json" }
            });

            if (!response.ok) throw new Error("Không thể kết nối API");
            const data = await response.json();
            title.textContent = data.joke;

        } catch (error) {
            console.error("Lỗi:", error);
            title.textContent = "Rất tiếc, đã có lỗi xảy ra. Thử lại sau nhé!";
        } finally {
            btnRandom.disabled = false;
            title.classList.remove("loading");
        }
    }

    btnRandom.addEventListener("click", getPosts);
    getPosts();
});