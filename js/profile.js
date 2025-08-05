// js/profile.js (PHIÊN BẢN SỬA LỖI)
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert("Vui lòng đăng nhập.");
        window.location.href = 'login.html';
        return;
    }
    displayAddresses();

    const addressForm = document.getElementById('address-form');
    const showFormBtn = document.getElementById('show-address-form-btn');
    const cancelBtn = document.getElementById('cancel-address-btn');

    showFormBtn.addEventListener('click', () => {
        addressForm.style.display = 'block';
        showFormBtn.style.display = 'none';
    });
    cancelBtn.addEventListener('click', () => {
        addressForm.style.display = 'none';
        showFormBtn.style.display = 'inline-block';
        addressForm.reset();
    });
    addressForm.addEventListener('submit', handleSaveAddress);
});

function displayAddresses() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const addressListDiv = document.getElementById('address-list');
    addressListDiv.innerHTML = '';
    if (!currentUser.addresses || currentUser.addresses.length === 0) {
        addressListDiv.innerHTML = '<p>Bạn chưa có địa chỉ nào được lưu.</p>';
        return;
    }
    currentUser.addresses.forEach(addr => {
        const addrCard = `<div class="address-card"><p><strong>${addr.fullName}</strong> - ${addr.phone}</p><p>${addr.details}</p><button class="btn btn-danger" onclick="deleteAddress('${addr.id}')">Xóa</button></div>`;
        addressListDiv.innerHTML += addrCard;
    });
}

function handleSaveAddress(e) {
    e.preventDefault();
    let users = JSON.parse(localStorage.getItem('users'));
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const newAddress = {
        id: 'addr_' + Date.now(),
        fullName: document.getElementById('address-fullname').value.trim(),
        phone: document.getElementById('address-phone').value.trim(),
        details: document.getElementById('address-details').value.trim(),
    };
    if (!newAddress.fullName || !newAddress.phone || !newAddress.details) { showToast("Vui lòng điền đầy đủ thông tin."); return; }
    if (!currentUser.addresses) { currentUser.addresses = []; }
    currentUser.addresses.push(newAddress);
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) { users[userIndex] = currentUser; }
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showToast("Đã lưu địa chỉ mới!");
    document.getElementById('address-form').style.display = 'none';
    document.getElementById('show-address-form-btn').style.display = 'inline-block';
    document.getElementById('address-form').reset();
    displayAddresses();
}

function deleteAddress(addressId) {
    if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
    let users = JSON.parse(localStorage.getItem('users'));
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.addresses = currentUser.addresses.filter(addr => addr.id !== addressId);
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) { users[userIndex] = currentUser; }
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showToast("Đã xóa địa chỉ.");
    displayAddresses();
}