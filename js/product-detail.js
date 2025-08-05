document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        displayProductDetails(productId);
    }
});

function displayProductDetails(productId) {
    const container = document.getElementById('product-detail-container');
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    if (!product) { container.innerHTML = '<h2>Sản phẩm không tồn tại.</h2>'; return; }
    document.title = product.name;
    const productHTML = `
        <div class="product-detail-layout">
            <div class="product-detail-image"><img src="${product.imageUrl}" alt="${product.name}"></div>
            <div class="product-detail-info">
                <h1>${product.name}</h1>
                <p class="price">${product.price.toLocaleString('vi-VN')} VNĐ</p>
                <p class="description">${product.description}</p>
                <div class="quantity-selector-wrapper">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Số lượng:</label>
                    <div class="quantity-selector">
                        <button class="btn-quantity" onclick="changeDetailQuantity(-1)">-</button>
                        <input type="number" class="quantity-input" id="detail-quantity" value="1" readonly>
                        <button class="btn-quantity" onclick="changeDetailQuantity(1)">+</button>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn" onclick="handleAddToCart('${product.id}', '${product.name}')">Thêm vào giỏ hàng</button>
                </div>
            </div>
        </div>`;
    container.innerHTML = productHTML;
}

function changeDetailQuantity(amount) {
    const quantityInput = document.getElementById('detail-quantity');
    let currentQuantity = parseInt(quantityInput.value);
    currentQuantity += amount;
    if (currentQuantity < 1) { currentQuantity = 1; }
    quantityInput.value = currentQuantity;
}

function handleAddToCart(productId, productName) {
    const quantityInput = document.getElementById('detail-quantity');
    const quantityToAdd = parseInt(quantityInput.value);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productInCart = cart.find(item => item.id === productId);
    if (productInCart) {
        productInCart.quantity += quantityToAdd;
    } else {
        cart.push({ id: productId, quantity: quantityToAdd });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    showToast(`Đã thêm ${quantityToAdd} "${productName}" vào giỏ!`);
    const addButton = document.querySelector('.action-buttons .btn');
    if (addButton) {
        addButton.textContent = 'Đã thêm! ✅';
        addButton.disabled = true;
    }
    setTimeout(() => window.location.href = 'index.html', 1500);
}