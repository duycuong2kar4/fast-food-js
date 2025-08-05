document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    if (orderId) {
        displayOrderDetail(orderId);
    }
});

function displayOrderDetail(orderId) {
    const container = document.getElementById('order-detail-container');
    const title = document.getElementById('order-title');
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const allProducts = JSON.parse(localStorage.getItem('products')) || [];
    const order = allOrders.find(o => o.id === orderId);
    if (!order) { container.innerHTML = '<p>Đơn hàng không tồn tại.</p>'; return; }
    title.textContent = `Chi Tiết Đơn Hàng #${order.id.split('_')[1]}`;
    let orderInfoHTML = `
        <div class="order-info">
            <p><strong>Ngày đặt:</strong> ${new Date(order.date).toLocaleString('vi-VN')}</p>
            <p><strong>Khách hàng:</strong> ${order.username}</p>
            <p><strong>Trạng thái:</strong> ${order.status}</p>
            <p><strong>Địa chỉ giao:</strong> ${order.shippingAddress.details}</p>
        </div>
        <h4>Các sản phẩm đã đặt:</h4>`;
    let itemsHTML = '';
    order.items.forEach(item => {
        const product = allProducts.find(p => p.id === item.id);
        if (product) {
            itemsHTML += `<div class="cart-item">...</div>`; // Dán lại HTML chi tiết
        }
    });
    const summaryHTML = `
        <div class="cart-separator"></div>
        <div class="cart-summary">
            <h2>Tổng cộng: ${order.total.toLocaleString('vi-VN')} VNĐ</h2>
            <a href="history.html" class="btn">Quay lại Lịch sử</a>
        </div>`;
    container.innerHTML = orderInfoHTML + itemsHTML + summaryHTML;
}