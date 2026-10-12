// Data Products
const products = [
    {
        id: 1,
        name: "Áo thun Basic",
        price: 150000,
        image: "images/ao-thun.jpg"
    },
    {
        id: 2,
        name: "Quần jean nam",
        price: 350000,
        image: "images/quan-jean.jpg"
    },
    {
        id: 3,
        name: "Giày sneaker",
        price: 650000,
        image: "images/giay-sneaker.jpg"
    },
    {
        id: 4,
        name: "Balo laptop",
        price: 420000,
        image: "images/balo.jpg"
    },
    {
        id: 5,
        name: "Mũ lưỡi trai",
        price: 120000,
        image: "images/mu.jpg"
    },
    {
        id: 6,
        name: "Tất thể thao",
        price: 50000,
        image: "images/tat.jpg"
    }
];

// LẤY CÁC PHẦN TỬ TRÊN TRANG
const product_list = document.querySelector('#product-list');
const cart_body = document.querySelector('#cart-body');
const cart_wrapper = document.querySelector('#cart-wrapper');
const cart_empty = document.querySelector('#cart-empty');
const stat_types = document.querySelector('#stat-types');
const stat_qty = document.querySelector('#stat-qty');
const stat_total = document.querySelector('#stat-total');

// Mảng chứa các sản phẩm đang có trong giỏ hàng
const productsCard = [];

const template = (data) => {
    return `
    <article class="product-card" data-id="${data.id}">
      <div class="product-image-wrapper">
        <img class="product-image" src="${data.image}" alt="${data.name}">
      </div>
      <div class="product-info">
        <h3 class="product-name">${data.name}</h3>
        <p class="product-price">${data.price}</p>
        <div class="product-actions">
          <button class="btn-add-to-cart" data-id="${data.id}">
            <i class="bi bi-cart-plus"></i>
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </article>
  `;
};

const render = (data) => {
    return product_list.innerHTML = data.map(template).join('');
};


product_list.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.btn-add-to-cart');
    if (!addBtn) return;

    const productId = addBtn.dataset.id;
    const product = products.find(item => String(item.id) === String(productId));
    if (!product) return;

    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const cartItem = productsCard.find(item => String(item.id) === String(productId));

    if (cartItem) {
        cartItem.cnt += 1;
    } else {
        productsCard.push({
            id: product.id,
            name: product.name,
            price: product.price,
            cnt: 1
        });
    }
    renderCart(productsCard);
});

const templateCard = (data) => {
    const sumItem = data.price * data.cnt;
    return `
    <tr class="item" data-set="${data.id}">
        <td>${data.name}</td>
        <td class="cart-item-price">${data.price}</td>
        <td>
            <div class="qty-controls">
                <button type="button" class="qty-btn btn-tru" aria-label="Giảm số lượng">
                    <i class="bi bi-dash-lg"></i>
                </button>
                <span class="qty-value">${data.cnt}</span>
                <button type="button" class="qty-btn btn-add" aria-label="Tăng số lượng">
                    <i class="bi bi-plus-lg"></i>
                </button>
            </div>
        </td>
        <td class="cart-item-subtotal">${sumItem}$</td>
        <td>
            <button type="button" class="btn-remove btn-delete" aria-label="Xóa sản phẩm">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    </tr>`;
};


const renderCart = (data) => {
    cart_body.innerHTML = data.map(templateCard).join('');

    const isEmpty = data.length === 0;
    cart_wrapper.classList.toggle('hidden', isEmpty);
    cart_empty.classList.toggle('hidden', !isEmpty);

    const totalTypes = data.length;
    const totalQty = data.reduce((total, item) => total + item.cnt, 0);
    const totalCartValue = data.reduce((total, item) => total + item.price * item.cnt, 0);

    stat_types.textContent = totalTypes;
    stat_qty.textContent = totalQty;
    stat_total.textContent = totalCartValue;
};


// + - delete
cart_body.addEventListener('click', (e) => {
    const row = e.target.closest('.item');
    if (!row) return;
    const index = productsCard.findIndex(item => String(item.id) === String(row.dataset.set));
    if (index === -1) return;

    if (e.target.closest('.btn-delete')) {
        productsCard.splice(index, 1);
    } else if (e.target.closest('.btn-add')) {
        productsCard[index].cnt += 1;
    } else if (e.target.closest('.btn-tru')) {
        productsCard[index].cnt -= 1;
        if (productsCard[index].cnt <= 0) {
            productsCard.splice(index, 1);
        }
    } else {
        return;
    }
    renderCart(productsCard);
});


render(products);
renderCart(productsCard);



