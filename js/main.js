// js/main.js (PHIÊN BẢN SỬA LỖI HIỂN THỊ)

// ==========================================================
// CÁC HÀM ĐƯỢC ĐỊNH NGHĨA Ở ĐÂY TRƯỚC
// ==========================================================

/**
 * Khởi tạo dữ liệu trong localStorage nếu chưa có
 */
function initApp() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(initialData.products));
    }
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(initialData.users));
    }
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
}

/**
 * Cập nhật giao diện header dựa trên trạng thái đăng nhập
 */
function updateHeaderUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // ... (Toàn bộ nội dung của hàm này giữ nguyên như cũ)
    const authLink = document.getElementById('auth-link');
    const welcomeMsg = document.getElementById('welcome-msg');
    const logoutLink = document.getElementById('logout-link');
    const userOnlyItems = document.querySelectorAll('.user-only');
    const adminOnlyItems = document.querySelectorAll('.admin-only');

    if (currentUser) {
        if (authLink) authLink.style.display = 'none';
        if (welcomeMsg) welcomeMsg.textContent = 'Chào, ' + currentUser.username;
        userOnlyItems.forEach(item => item.style.display = 'inline-block');
        if (currentUser.role === 'admin') {
            adminOnlyItems.forEach(item => item.style.display = 'inline-block');
        }
        if(logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                showToast('Đã đăng xuất.');
                setTimeout(() => window.location.href = 'index.html', 1000);
            });
        }
    } else {
        if (authLink) authLink.style.display = 'inline-block';
        userOnlyItems.forEach(item => item.style.display = 'none');
        adminOnlyItems.forEach(item => item.style.display = 'none');
    }
}

/**
 * Cập nhật số lượng sản phẩm trên icon giỏ hàng
 */
function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

/**
 * Hiển thị danh sách sản phẩm được cung cấp ra màn hình
 * @param {Array} productsToDisplay - Mảng sản phẩm cần hiển thị
 */
function displayProducts(productsToDisplay) {
    const productListDiv = document.getElementById('product-list');
    if (!productListDiv) return;

    productListDiv.innerHTML = '';

    if (productsToDisplay.length === 0) {
        productListDiv.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Không tìm thấy sản phẩm nào phù hợp.</p>';
        return;
    }

    productsToDisplay.forEach(product => {
        const productCardHTML = `
            <div class="product-card">
                <div class="product-image-container">
                    <img src="${product.imageUrl}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    ${renderStars(product.avgRating)}
                    <p class="description">${product.description}</p>
                    <div class="product-footer">
                        <p class="price">${product.price.toLocaleString('vi-VN')} VNĐ</p>
                        <button class="btn btn-add-to-cart" onclick="addToCart('${product.id}')">Thêm</button>
                    </div>
                </div>
            </div>
        `;
        productListDiv.innerHTML += productCardHTML;
    });
}

/**
 * Thêm sản phẩm vào giỏ hàng
 */
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productInCart = cart.find(item => item.id === productId);
    if (productInCart) {
        productInCart.quantity++;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    showToast('Đã thêm sản phẩm vào giỏ hàng!');
    updateCartIcon();
}

/**
 * Tạo HTML cho các ngôi sao đánh giá
 */
function renderStars(rating = 0) {
    let starsHTML = '';
    const fullStars = Math.round(rating);
    for (let i = 0; i < 5; i++) {
        starsHTML += (i < fullStars) ? '⭐' : '☆';
    }
    return `<div class="stars">${starsHTML}</div>`;
}

/**
 * Hiển thị thông báo toast
 */
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('show'); }, 100);
    setTimeout(() => { toast.classList.remove('show'); toast.addEventListener('transitionend', () => toast.remove()); }, 3000);
}


// ==========================================================
// ĐẶT CÁC HÀM CHÈN HEADER VÀ SỰ KIỆN CHÍNH Ở CUỐI CÙNG
// ==========================================================

// Hàm này chạy ngay khi file JS được tải để chèn header vào ngay lập tức.
function insertHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;
    headerPlaceholder.innerHTML = `<div class="container"><a href="index.html" class="logo">FoodJS</a><nav id="main-nav"><a href="cart.html">Giỏ Hàng (<span id="cart-count">0</span>)</a><a href="history.html" class="nav-item user-only" style="display: none;">Lịch Sử</a><a href="admin.html" class="nav-item admin-only" style="display: none;">Quản Trị</a><a href="login.html" class="nav-item" id="auth-link">Đăng Nhập</a><span class="nav-item user-only" id="welcome-msg" style="display: none;"></span><a href="#" class="nav-item user-only" id="logout-link" style="display: none;">Đăng Xuất</a></nav></div>`;
}

// Chạy hàm chèn header ngay
insertHeader();

// Sự kiện DOMContentLoaded đảm bảo toàn bộ HTML đã được tải xong trước khi chạy code bên trong
document.addEventListener('DOMContentLoaded', function() {
    // Các hàm này cần chạy trên MỌI trang
    initApp();
    updateHeaderUI();
    updateCartIcon();

    // Logic chỉ dành riêng cho trang chủ
    const productListDiv = document.getElementById('product-list');
    if (productListDiv) {
        const allProducts = JSON.parse(localStorage.getItem('products')) || [];
        
        displayProducts(allProducts);

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase().trim();
                const filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
                displayProducts(filteredProducts);
            });
        }
    }
});