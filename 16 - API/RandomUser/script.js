window.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://randomuser.me/api/';

    const div = document.querySelector('.flex.items-center');
    const btnRandom = document.querySelector('#generate');
    function render(data) {
        div.innerHTML = data.map(value => {
            return `
                <img id="avatar" class="w-48 h-48 rounded-full mr-8 object-cover" src="${value.picture.large}" alt="User Avatar" />      
                <div class="space-y-3">
                    <p class="text-xl">
                        <span class="font-bold">Name: </span>${value.name.first} ${value.name.last}
                    </p>
                    <p class="text-xl">
                        <span class="font-bold">Email: </span>${value.email}
                    </p>
                    <p class="text-xl">
                        <span class="font-bold">Phone: </span>${value.phone}
                    </p>
                    <p class="text-xl">
                        <span class="font-bold">Location: </span>${value.location.city}, ${value.location.country}
                    </p>
                    <p class="text-xl"><span class="font-bold">Age: </span>${value.dob.age}</p>
                </div>
            `;
        }).join('');
    }

    const getData = async () => {
        try {
            div.innerHTML = '<p class="text-xl animate-pulse">Loading...</p>';
            const res = await fetch(API_URL);
            if (!res.ok) {
                throw new Error('Không thể kết nối mạng');
            }
            const data = await res.json();
            console.log(data);
            render(data.results);
        } catch (err) {
            console.error(err);
        }
    }
    btnRandom.addEventListener('click', getData);
    getData();


})