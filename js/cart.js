

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert("Vui lòng đăng nhập để xem giỏ hàng.");
        window.location.href = 'login.html';
        return;
    }
    displayCart();
    displayShippingAddressOptions();
});

function displayCart() {
    const cartContainer = document.getElementById('cart-container');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const products = JSON.parse(localStorage.getItem('products'));

    if (cart.length === 0) {
        cartContainer.innerHTML = `<div class="empty-state"><p>Giỏ hàng của bạn đang trống.</p><a href="index.html" class="btn">Quay lại mua sắm</a></div>`;
        document.getElementById('shipping-address-container').style.display = 'none';
        return;
    }

    let itemsHTML = '';
    let totalAmount = 0;
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;
            itemsHTML += `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${product.imageUrl}" alt="${product.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${product.name}</h4>
                        <p>${product.price.toLocaleString('vi-VN')} VNĐ</p>
                    </div>
                    <div class="cart-item-quantity">
                        <div class="quantity-selector">
                            <button class="btn-quantity" onclick="changeQuantity('${product.id}', -1)">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" readonly>
                            <button class="btn-quantity" onclick="changeQuantity('${product.id}', 1)">+</button>
                        </div>
                    </div>
                    <div class="cart-item-total">
                        ${itemTotal.toLocaleString('vi-VN')} VNĐ
                    </div>
                    <div class="cart-item-remove">
                        <button class="btn btn-danger" onclick="removeFromCart('${product.id}')">Xóa</button>
                    </div>
                </div>
            `;
        }
    });
    
    const fullCartHTML = `
        ${itemsHTML}
        <div class="cart-separator"></div>
        <div class="cart-summary">
            <h2>Tổng cộng: ${totalAmount.toLocaleString('vi-VN')} VNĐ</h2>
            <button class="btn" onclick="placeOrder()">Thanh Toán Ngay</button>
        </div>
    `;
    cartContainer.innerHTML = fullCartHTML;
}

function displayShippingAddressOptions() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const shippingContainer = document.getElementById('shipping-address-container');
    const addressOptionsDiv = document.getElementById('address-options');

    if (currentUser && cart.length > 0) {
        shippingContainer.style.display = 'block';
        if (currentUser.addresses && currentUser.addresses.length > 0) {
            addressOptionsDiv.innerHTML = '';
            currentUser.addresses.forEach((addr, index) => {
                const optionHTML = `
                    <div class="address-option-item">
                        <input type="radio" name="shippingAddress" value="${addr.id}" id="addr-${addr.id}" ${index === 0 ? 'checked' : ''}>
                        <label for="addr-${addr.id}">
                            <strong>${addr.fullName}</strong> - ${addr.phone}<br>
                            <span>${addr.details}</span>
                        </label>
                    </div>
                `;
                addressOptionsDiv.innerHTML += optionHTML;
            });
        } else {
            addressOptionsDiv.innerHTML = '<p>Bạn chưa có địa chỉ giao hàng. Vui lòng thêm địa chỉ trong trang Tài Khoản.</p>';
        }
    } else {
        if (shippingContainer) shippingContainer.style.display = 'none';
    }
}

function changeQuantity(productId, amount) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemInCart = cart.find(item => item.id === productId);
    if (itemInCart) {
        itemInCart.quantity += amount;
        if (itemInCart.quantity <= 0) {
            removeFromCart(productId, true);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            updateCartIcon();
        }
    }
}

function removeFromCart(productId, skipConfirm = false) {
    if (!skipConfirm && !confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        return;
    }
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    displayShippingAddressOptions();
    updateCartIcon();
}

function placeOrder() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cart = JSON.parse(localStorage.getItem('cart'));
    
    if (!currentUser.addresses || currentUser.addresses.length === 0) {
        showToast("Vui lòng thêm địa chỉ giao hàng trong trang Tài Khoản!");
        return;
    }
    const selectedAddressRadio = document.querySelector('input[name="shippingAddress"]:checked');
    if (!selectedAddressRadio) {
        showToast("Vui lòng chọn một địa chỉ giao hàng!");
        return;
    }
    const selectedAddressId = selectedAddressRadio.value;
    const selectedAddress = currentUser.addresses.find(addr => addr.id === selectedAddressId);
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const totalAmount = cart.reduce((sum, item) => {
        const product = JSON.parse(localStorage.getItem('products')).find(p => p.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    const newOrder = {
        id: 'order_' + Date.now(),
        userId: currentUser.id,
        username: currentUser.username,
        items: cart,
        total: totalAmount,
        date: new Date().toISOString(),
        status: 'Đang xử lý',
        shippingAddress: selectedAddress
    };

    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('cart', JSON.stringify([]));
    
    showToast('Đặt hàng thành công!');
    updateCartIcon();
    setTimeout(() => window.location.href = 'history.html', 1500);
}