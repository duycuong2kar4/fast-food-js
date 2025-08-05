

document.addEventListener('DOMContentLoaded', function() {
    initApp();
    updateHeaderUI();
    updateCartIcon();
      
    const productListDiv = document.getElementById('product-list');
    if (productListDiv) {
        try {
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
        } catch (error) {
            console.error("Lỗi khi hiển thị sản phẩm:", error);
            productListDiv.innerHTML = "<p>Đã xảy ra lỗi khi tải thực đơn.</p>";
        }
    }
});

function initApp() {
    try {
        if (!localStorage.getItem('products')) { localStorage.setItem('products', JSON.stringify(initialData.products)); }
        if (!localStorage.getItem('users')) {
            const usersWithAddress = initialData.users.map(user => ({...user, addresses: []}));
            localStorage.setItem('users', JSON.stringify(usersWithAddress)); 
        }
        if (!localStorage.getItem('cart')) { localStorage.setItem('cart', JSON.stringify([])); }
        if (!localStorage.getItem('orders')) { localStorage.setItem('orders', JSON.stringify([])); }
    } catch (error) {
        console.error("Lỗi khi khởi tạo dữ liệu:", error);
    }
}

function updateHeaderUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authLink = document.getElementById('auth-link');
    const welcomeMsg = document.getElementById('welcome-msg');
    const logoutLink = document.getElementById('logout-link');
    const userOnlyItems = document.querySelectorAll('.user-only');
    const adminOnlyItems = document.querySelectorAll('.admin-only');
    if (currentUser) {
        if (authLink) authLink.style.display = 'none';
        userOnlyItems.forEach(item => item.style.display = 'inline-block');
        if (welcomeMsg) welcomeMsg.textContent = 'Chào, ' + currentUser.username;
        if(logoutLink) {
            const newLogoutLink = logoutLink.cloneNode(true);
            logoutLink.parentNode.replaceChild(newLogoutLink, logoutLink);
            newLogoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                showToast('Đã đăng xuất.');
                setTimeout(() => window.location.href = 'index.html', 1000);
            });
        }
        if (currentUser.role === 'admin') {
            adminOnlyItems.forEach(item => item.style.display = 'inline-block');
        } else {
            adminOnlyItems.forEach(item => item.style.display = 'none');
        }
    } else {
        if (authLink) authLink.style.display = 'inline-block';
        userOnlyItems.forEach(item => item.style.display = 'none');
        adminOnlyItems.forEach(item => item.style.display = 'none');
    }
}

function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function renderStars(rating = 0) {
    let starsHTML = '';
    const fullStars = Math.round(rating);
    for (let i = 0; i < 5; i++) {
        starsHTML += (i < fullStars) ? '⭐' : '☆';
    }
    return starsHTML;
}

function displayProducts(productsToDisplay) {
    const productListDiv = document.getElementById('product-list');
    if (!productListDiv) return;
    productListDiv.innerHTML = '';
    if (!productsToDisplay || productsToDisplay.length === 0) {
        productListDiv.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Không tìm thấy sản phẩm nào.</p>';
        return;
    }
    productsToDisplay.forEach(product => {
        const productCardHTML = `
            <div class="product-card">
                <a href="product-detail.html?id=${product.id}" class="product-card-link">
                    <div class="product-image-container"><img src="${product.imageUrl}" alt="${product.name}"></div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <div class="stars">${renderStars(product.avgRating)}</div>
                        <p class="description">${product.description}</p>
                    </div>
                </a>
                <div class="product-footer">
                    <p class="price">${product.price.toLocaleString('vi-VN')} VNĐ</p>
                    <button class="btn-add-to-cart" onclick="addToCart('${product.id}')">Thêm</button>
                </div>
            </div>`;
        productListDiv.innerHTML += productCardHTML;
    });
}

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

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}