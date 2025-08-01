// js/auth.js

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Nếu người dùng đã đăng nhập rồi thì không cho vào trang này nữa
    if (localStorage.getItem('currentUser')) {
        showToast("Bạn đã đăng nhập rồi!");
        // Chuyển hướng về trang chủ sau một khoảng thời gian ngắn
        setTimeout(() => window.location.href = 'index.html', 1000);
    }

    // Gán sự kiện cho form đăng nhập
    if(loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Ngăn trình duyệt tải lại trang
            handleLogin();
        });
    }
    
    // Gán sự kiện cho form đăng ký
    if(registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Ngăn trình duyệt tải lại trang
            handleRegister();
        });
    }
});

/**
 * Xử lý logic đăng nhập
 */
function handleLogin() {
    const username = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    
    if (!username || !pass) {
        showToast("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    // Lấy danh sách người dùng từ "database" localStorage
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Tìm người dùng có thông tin trùng khớp
    const user = users.find(u => u.username === username && u.password === pass);

    if (user) {
        // Nếu tìm thấy, lưu trạng thái đăng nhập
        localStorage.setItem('currentUser', JSON.stringify(user));
        showToast('Đăng nhập thành công! Chào mừng ' + user.username);
        // Chuyển về trang chủ sau khi thông báo hiển thị xong
        setTimeout(() => window.location.href = 'index.html', 1500);
    } else {
        // Nếu không tìm thấy, thông báo lỗi
        showToast('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
}

/**
 * Xử lý logic đăng ký
 */
function handleRegister() {
    const username = document.getElementById('register-username').value.trim();
    const pass = document.getElementById('register-password').value.trim();

    if (!username || !pass) {
        showToast("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users'));
    
    // Kiểm tra xem tên người dùng đã tồn tại hay chưa
    const userExists = users.some(u => u.username === username);

    if (userExists) {
        showToast('Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác.');
        return;
    }

    // Tạo đối tượng người dùng mới
    const newUser = {
        id: 'u' + Date.now(),
        username: username,
        password: pass,
        role: 'customer' // Mặc định người dùng mới là khách hàng
    };

    // Thêm người dùng mới vào danh sách và lưu lại
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showToast('Đăng ký thành công! Giờ bạn có thể đăng nhập.');
    document.getElementById('register-form').reset(); // Xóa các trường trong form đăng ký
}