# 🍔 Website Đặt Đồ Ăn Nhanh - FoodJS

Đây là một dự án xây dựng trang web đặt đồ ăn nhanh hoàn chỉnh, được phát triển từ đầu chỉ với HTML, CSS và JavaScript thuần (Vanilla JS). Dự án không sử dụng bất kỳ framework, thư viện hay cơ sở dữ liệu nào, toàn bộ dữ liệu được quản lý thông qua `localStorage` của trình duyệt.

## 🚀 Demo Live

## ✨ Các Chức Năng Chính

### 👤 Dành cho Khách hàng
- **Đăng ký / Đăng nhập:** Tạo tài khoản mới và đăng nhập.
- **Xem và Tìm kiếm:** Duyệt xem danh sách các món ăn và tìm kiếm theo tên.
- **Giỏ hàng:** Thêm/sửa/xóa sản phẩm trong giỏ hàng.
- **Đặt hàng:** Hoàn tất đơn hàng và lưu lại lịch sử.
- **Lịch sử mua hàng:** Xem lại các đơn hàng đã đặt.
- **Đánh giá món ăn:** Đánh giá sao cho các sản phẩm đã mua.

### ⚙️ Dành cho Quản trị viên (Admin)
- **Quản lý Món ăn (CRUD):** Thêm, sửa, xóa các món ăn trong thực đơn.
- **Quản lý Đơn hàng:** Xem tất cả đơn hàng của khách và cập nhật trạng thái (Đang xử lý, Hoàn thành, Đã hủy).
- **Quản lý Người dùng:** (Có thể thêm chức năng này sau)
- **Thống kê:** (Có thể thêm chức năng này sau)

## 🛠️ Công Nghệ Sử Dụng
- **HTML5:** Sử dụng các thẻ ngữ nghĩa để xây dựng cấu trúc trang web.
- **CSS3:**
  - CSS Variables để quản lý màu sắc và font chữ một cách nhất quán.
- **JavaScript :**
  - Thao tác với DOM để tạo giao diện động.
  - Xử lý sự kiện người dùng (click, input...).
  - Quản lý toàn bộ trạng thái ứng dụng.
- **LocalStorage:** Được sử dụng như một "cơ sở dữ liệu giả" để lưu trữ thông tin sản phẩm, người dùng, giỏ hàng và đơn hàng ngay trên trình duyệt.

## 📂 Hướng Dẫn Cài Đặt và Chạy Dự Án

1.  **Clone repository về máy của bạn:**
    ```bash
    git clone https://github.com/duycuong2kar4/fast-food-js.git
    ```
2.  **Mở dự án bằng Visual Studio Code.**
3.  **Cài đặt extension "Live Server"** trong VS Code (nếu bạn chưa có).
4.  Chuột phải vào file `index.html` và chọn **"Open with Live Server"**.

## 🔑 Tài Khoản Demo
- **Tài khoản Admin:**
  - **Username:** `admin`
  - **Password:** `123`
- **Tài khoản Khách hàng:**
  - **Username:** `khachhang`
  - **Password:** `123`
  - (Hoặc bạn có thể tự đăng ký một tài khoản mới)