document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Truy cập bị từ chối.');
        window.location.href = 'index.html';
        return;
    }
    displayAdminProducts();
    displayAdminOrders();
    const productForm = document.getElementById('product-form');
    productForm.addEventListener('submit', handleProductFormSubmit);
    document.getElementById('show-add-form-btn').addEventListener('click', showAddForm);
    document.getElementById('cancel-edit-btn').addEventListener('click', hideProductForm);
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
function displayAdminProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const tableBody = document.getElementById('product-table-body');
    tableBody.innerHTML = '';
    products.forEach(product => {
        tableBody.innerHTML += `<tr><td>${product.name}</td><td>${product.price.toLocaleString('vi-VN')} VNĐ</td><td>${product.category === 'food' ? 'Đồ ăn' : 'Thức uống'}</td><td><button class="btn" onclick="editProduct('${product.id}')">Sửa</button><button class="btn btn-danger" onclick="deleteProduct('${product.id}')">Xóa</button></td></tr>`;
    });
}
function showAddForm() {
    document.getElementById('form-title').innerText = 'Thêm sản phẩm mới';
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('product-form').style.display = 'block';
}
function hideProductForm() {
    document.getElementById('product-form').style.display = 'none';
}
function handleProductFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const newProduct = {
        id: id || 'p' + Date.now(),
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-desc').value,
        price: parseInt(document.getElementById('product-price').value),
        imageUrl: document.getElementById('product-image').value,
        category: document.getElementById('product-category').value,
        ratings: [],
        avgRating: 0
    };
    let products = JSON.parse(localStorage.getItem('products')) || [];
    if (id) {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            newProduct.ratings = products[index].ratings;
            newProduct.avgRating = products[index].avgRating;
            products[index] = newProduct;
        }
    } else {
        products.push(newProduct);
    }
    localStorage.setItem('products', JSON.stringify(products));
    displayAdminProducts();
    hideProductForm();
}
function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('form-title').innerText = 'Sửa sản phẩm';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-desc').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-image').value = product.imageUrl;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-form').style.display = 'block';
    }
}
function deleteProduct(productId) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) { return; }
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(products));
    displayAdminProducts();
}
function displayAdminOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tableBody = document.getElementById('order-table-body');
    tableBody.innerHTML = '';
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    orders.forEach(order => {
        tableBody.innerHTML += `<tr><td>${order.id}</td><td>${order.username}</td><td>${new Date(order.date).toLocaleString('vi-VN')}</td><td>${order.total.toLocaleString('vi-VN')} VNĐ</td><td>${order.status}</td><td><select onchange="updateOrderStatus('${order.id}', this.value)"><option value="Đang xử lý" ${order.status === 'Đang xử lý' ? 'selected' : ''}>Đang xử lý</option><option value="Hoàn thành" ${order.status === 'Hoàn thành' ? 'selected' : ''}>Hoàn thành</option><option value="Đã hủy" ${order.status === 'Đã hủy' ? 'selected' : ''}>Đã hủy</option></select></td></tr>`;
    });
}
function updateOrderStatus(orderId, newStatus) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
    }
}