document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) { 
        alert("Vui lòng đăng nhập để xem lịch sử.");
        window.location.href = 'login.html';
        return; 
    }
    displayOrderHistory(currentUser.id);
});

function displayOrderHistory(userId) {
    const orderListDiv = document.getElementById('order-list');
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = allOrders.filter(order => order.userId === userId);

    if (userOrders.length === 0) {
        orderListDiv.innerHTML = `<div class="card empty-state"><p>Bạn chưa có đơn hàng nào.</p><a href="index.html" class="btn">Bắt đầu mua sắm</a></div>`;
        return;
    }

    userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    let html = '';
    userOrders.forEach(order => {
        const statusClass = order.status.toLowerCase().replace(/\s+/g, '-');
        html += `
            <div class="card order-card"> 
                <div class="order-header">
                    <h3>Mã đơn hàng: #${order.id.split('_')[1]}</h3>
                    <span class="order-date">${new Date(order.date).toLocaleDateString('vi-VN')}</span>
                </div>
                <div class="order-details">
                    <p>Tổng tiền: <strong>${order.total.toLocaleString('vi-VN')} VNĐ</strong></p>
                    <p>Trạng thái: <span class="status status-${statusClass}">${order.status}</span></p>
                </div>
                <div class="order-actions">
                    <a href="order-detail.html?id=${order.id}" class="btn btn-secondary">Xem Chi Tiết</a>
                    <button class="btn" onclick="reOrder('${order.id}')">Đặt Lại</button>
                </div>
            </div>
        `;
    });
    orderListDiv.innerHTML = html;
}

function reOrder(orderId) {
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderToReorder = allOrders.find(order => order.id === orderId);
    if (orderToReorder && orderToReorder.items) {
        localStorage.setItem('cart', JSON.stringify(orderToReorder.items));
        showToast("Đã thêm các sản phẩm vào giỏ hàng!");
        updateCartIcon();
        setTimeout(() => window.location.href = 'cart.html', 1500);
    } else {
        showToast("Không thể đặt lại đơn hàng này.");
    }
}