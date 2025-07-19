document.addEventListener('DOMContentLoaded', function() {
    displayCart();
});
function displayCart() {
    const cartContainer = document.getElementById('cart-container');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const products = JSON.parse(localStorage.getItem('products'));
    if (cart.length === 0) {
        cartContainer.innerHTML = `<div class="cart-card"><div class="empty-state"><p>Giỏ hàng của bạn đang trống.</p><a href="index.html" class="btn">Quay lại mua sắm</a></div></div>`;
        return;
    }
    let itemsHTML = '';
    let totalAmount = 0;
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;
            itemsHTML += `<div class="cart-item"><div class="cart-item-image"><img src="${product.imageUrl}" alt="${product.name}"></div><div class="cart-item-details"><h4>${product.name}</h4><p>${product.price.toLocaleString('vi-VN')} VNĐ</p></div><div class="cart-item-quantity"><div class="quantity-selector"><button class="btn-quantity" onclick="changeQuantity('${product.id}', -1)">-</button><input type="number" class="quantity-input" value="${item.quantity}" readonly><button class="btn-quantity" onclick="changeQuantity('${product.id}', 1)">+</button></div></div><div class="cart-item-total">${itemTotal.toLocaleString('vi-VN')} VNĐ</div><div class="cart-item-remove"><button class="btn btn-danger" onclick="removeFromCart('${product.id}')">Xóa</button></div></div>`;
        }
    });
    cartContainer.innerHTML = `<div class="cart-card">${itemsHTML}<div class="cart-separator"></div><div class="cart-summary"><h2>Tổng cộng: ${totalAmount.toLocaleString('vi-VN')} VNĐ</h2><button class="btn" onclick="placeOrder()">Tiến hành Đặt Hàng</button></div></div>`;
}
function changeQuantity(productId, amount) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemInCart = cart.find(item => item.id === productId);
    if (itemInCart) {
        if (amount === -1 && itemInCart.quantity === 1) { return; }
        itemInCart.quantity += amount;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartIcon();
    }
}
function removeFromCart(productId) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) { return; }
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartIcon();
}
function placeOrder() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) { showToast('Vui lòng đăng nhập để đặt hàng!'); setTimeout(() => window.location.href = 'login.html', 1000); return; }
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (!cart || cart.length === 0) { showToast('Giỏ hàng trống, không thể đặt hàng.'); return; }
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const totalAmount = cart.reduce((sum, item) => {
        const product = JSON.parse(localStorage.getItem('products')).find(p => p.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    const newOrder = { id: 'order_' + Date.now(), userId: currentUser.id, username: currentUser.username, items: cart, total: totalAmount, date: new Date().toISOString(), status: 'Đang xử lý' };
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('cart', JSON.stringify([]));
    showToast('Đặt hàng thành công!');
    updateCartIcon();
    setTimeout(() => window.location.href = 'history.html', 1000);
}