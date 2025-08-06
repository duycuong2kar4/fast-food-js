document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    if (localStorage.getItem('currentUser')) {
        showToast("Bạn đã đăng nhập rồi!");
        setTimeout(() => window.location.href = 'index.html', 1000);
    }
    if(loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    if(registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }
});

function handleLogin() {
    const username = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    if (!username || !pass) { showToast("Vui lòng nhập đầy đủ thông tin."); return; }
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.username === username && u.password === pass);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        showToast('Đăng nhập thành công! Chào mừng ' + user.username);
        setTimeout(() => window.location.href = 'index.html', 1500);
    } else {
        showToast('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
}

function handleRegister() {
    const username = document.getElementById('register-username').value.trim();
    const pass = document.getElementById('register-password').value.trim();
    if (!username || !pass) { showToast("Vui lòng nhập đầy đủ thông tin."); return; }
    let users = JSON.parse(localStorage.getItem('users'));
    if (users.some(u => u.username === username)) { showToast('Tên đăng nhập đã tồn tại!'); return; }
    const newUser = { id: 'u' + Date.now(), username: username, password: pass, role: 'customer', addresses: [] };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    showToast('Đăng ký thành công! Giờ bạn có thể đăng nhập.');
    document.getElementById('register-form').reset();
}