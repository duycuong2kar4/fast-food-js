// js/admin.js

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Truy cập bị từ chối. Bạn không phải là quản trị viên.');
        window.location.href = 'index.html';
        return;
    }

    displayAdminProducts();
    displayAdminOrders();
    displayUsers();
    generateStatistics();

    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', handleProductFormSubmit);
    }
    
    const showAddFormBtn = document.getElementById('show-add-form-btn');
    if (showAddFormBtn) {
        showAddFormBtn.addEventListener('click', showAddForm);
    }
});

function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) { tabcontent[i].style.display = "none"; }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) { tablinks[i].className = tablinks[i].className.replace(" active", ""); }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function generateStatistics() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('total-revenue').textContent = totalRevenue.toLocaleString('vi-VN') + ' VNĐ';
    document.getElementById('total-orders').textContent = orders.length;
    const totalCustomers = users.filter(u => u.role === 'customer').length;
    document.getElementById('total-customers').textContent = totalCustomers;

    const allItems = orders.flatMap(order => order.items);
    if (allItems.length > 0) {
        const itemCounts = allItems.reduce((counts, item) => {
            counts[item.id] = (counts[item.id] || 0) + item.quantity;
            return counts;
        }, {});
        const bestSellerId = Object.keys(itemCounts).reduce((a, b) => itemCounts[a] > itemCounts[b] ? a : b);
        const bestSeller = products.find(p => p.id === bestSellerId);
        document.getElementById('best-seller').textContent = bestSeller ? bestSeller.name : 'Chưa có';
    }
}

function displayAdminProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const tableBody = document.getElementById('product-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    products.forEach(product => {
        const row = `
            <tr>
                <td>${product.name}</td>
                <td>${product.price.toLocaleString('vi-VN')} VNĐ</td>
                <td>
                    <button class="btn" onclick="editProduct('${product.id}')">Sửa</button>
                    <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">Xóa</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function showAddForm() {
    const productForm = document.getElementById('product-form');
    productForm.innerHTML = `
        <h3 id="form-title">Thêm sản phẩm mới</h3>
        <input type="hidden" id="product-id">
        <input type="text" id="product-name" placeholder="Tên sản phẩm" required>
        <textarea id="product-desc" placeholder="Mô tả sản phẩm" required></textarea>
        <input type="number" id="product-price" placeholder="Giá tiền" required>
        <input type="text" id="product-image" placeholder="URL hình ảnh" required>
        <div class="form-actions">
            <button type="submit" class="btn">Lưu sản phẩm</button>
            <button type="button" class="btn btn-danger" id="cancel-edit-btn">Hủy</button>
        </div>
    `;
    productForm.style.display = 'block';
    document.getElementById('cancel-edit-btn').addEventListener('click', hideProductForm);
}

function hideProductForm() {
    const productForm = document.getElementById('product-form');
    productForm.style.display = 'none';
    productForm.innerHTML = ''; 
}

function handleProductFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const newProductData = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-desc').value,
        price: parseInt(document.getElementById('product-price').value),
        imageUrl: document.getElementById('product-image').value,
    };
    let products = JSON.parse(localStorage.getItem('products')) || [];
    if (id) {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...newProductData };
        }
    } else {
        const newProduct = {
            id: 'p' + Date.now(),
            ...newProductData,
            category: "food",
            ratings: [],
            avgRating: 0
        };
        products.push(newProduct);
    }
    localStorage.setItem('products', JSON.stringify(products));
    showToast(id ? "Đã cập nhật sản phẩm!" : "Đã thêm sản phẩm mới!");
    displayAdminProducts();
    hideProductForm();
}

function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    if (product) {
        showAddForm();
        document.getElementById('form-title').innerText = 'Sửa sản phẩm';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-desc').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-image').value = product.imageUrl;
    }
}

function deleteProduct(productId) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(products));
    showToast("Đã xóa sản phẩm.");
    displayAdminProducts();
}

function displayAdminOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tableBody = document.getElementById('order-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    orders.forEach(order => {
        const row = `
            <tr>
                <td><a href="order-detail.html?id=${order.id}">${order.id}</a></td>
                <td>${order.username}</td>
                <td>${new Date(order.date).toLocaleString('vi-VN')}</td>
                <td>${order.total.toLocaleString('vi-VN')} VNĐ</td>
                <td>${order.status}</td>
                <td>
                    <select onchange="updateOrderStatus('${order.id}', this.value)">
                        <option value="Đang xử lý" ${order.status === 'Đang xử lý' ? 'selected' : ''}>Đang xử lý</option>
                        <option value="Hoàn thành" ${order.status === 'Hoàn thành' ? 'selected' : ''}>Hoàn thành</option>
                        <option value="Đã hủy" ${order.status === 'Đã hủy' ? 'selected' : ''}>Đã hủy</option>
                    </select>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function updateOrderStatus(orderId, newStatus) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        showToast("Đã cập nhật trạng thái đơn hàng.");
    }
}

function displayUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tableBody = document.getElementById('user-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    users.forEach(user => {
        const row = `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td>
                    ${user.role !== 'admin' ? `<button class="btn btn-danger" onclick="deleteUser('${user.id}')">Xóa</button>` : 'Không thể xóa'}
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function deleteUser(userId) {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(user => user.id !== userId);
    localStorage.setItem('users', JSON.stringify(users));
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders = orders.filter(order => order.userId !== userId);
    localStorage.setItem('orders', JSON.stringify(orders));
    showToast("Đã xóa người dùng và các đơn hàng liên quan.");
    displayUsers();
    generateStatistics();
}