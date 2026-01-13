# 🎬 Cinema Admin - Movie Booking Application

Hệ thống đặt vé xem phim trực tuyến hiện đại, bao gồm trang quản trị (Admin Dashboard) và trang người dùng (Booking Interface). Dự án được phát triển bằng Next.js với giao diện đẹp mắt, tối ưu trải nghiệm người dùng.

## ✨ Tính Năng Chính

### 👤 Người Dùng (Client Site)
-   **Trang Chủ**: Hiển thị danh sách phim đang chiếu và sắp chiếu với thanh công cụ tìm kiếm và lọc tiện lợi.
-   **Chi Tiết Phim**: Xem thông tin chi tiết, trailer (liên kết YouTube), đánh giá và lịch chiếu.
-   **Đặt Vé Trực Tuyến**:
    -   Chọn suất chiếu theo ngày giờ.
    -   Sơ đồ chọn ghế trực quan (Ghế thường, VIP, Couple).
    -   Tích hợp chọn Combo bắp nướng.
    -   Áp dụng mã giảm giá (Voucher).
-   **Thanh Toán**: Hỗ trợ thanh toán qua mã QR MoMo hoặc thanh toán tại quầy.
-   **Lịch Sử Giao Dịch**: Xem lại danh sách vé đã đặt và trạng thái đơn hàng.

### 🛡️ Quản Trị (Admin Dashboard)
-   **Dashboard Tổng Quan**: Giao diện Grid trực quan truy cập nhanh các module quản lý.
-   **Quản Lý Phim**: Thêm, sửa, xóa phim, cập nhật trailer, poster, trạng thái chiếu.
-   **Quản Lý Rạp & Phòng Chiếu**: Thiết lập cấu hình rạp, phòng chiếu và sơ đồ ghế ngồi.
-   **Quản Lý Suất Chiếu**: Lên lịch chiếu phim linh hoạt.
-   **Quản Lý Khác**:
    -   Đồ ăn & Nước uống (F&B)
    -   Thể loại phim
    -   Bảng giá vé (Seat Prices)
    -   Mã giảm giá (Vouchers)

## 🛠️ Công Nghệ Sử Dụng

-   **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), React 19
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS v4, Lucide React (Icons)
-   **API Integration**: Custom fetch wrapper with Type-safe API methods.
-   **State Management**: React Hooks (useState, useEffect, useContext).

## 🚀 Cài Đặt & Chạy Dự Án

### Yêu Cầu
-   Node.js 18.17+
-   npm, yarn, pnpm, hoặc bun

### Hướng Dẫn
1.  **Clone dự án**:
    ```bash
    git clone https://github.com/camapcon0702/movie-booking-app.git
    cd movie-booking-app
    ```

2.  **Cài đặt dependencies**:
    ```bash
    npm install
    # hoặc
    yarn install
    ```

3.  **Cấu hình môi trường**:
    -   Tạo file `.env.local` nếu cần thiết (ví dụ API URL).
    -   Mặc định API trỏ về `NEXT_PUBLIC_API_URL` (cấu hình trong `src/lib/api/client.ts` hoặc tương đương).

4.  **Chạy server development**:
    ```bash
    npm run dev
    ```

5.  **Mở trình duyệt**:
    Truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📂 Cấu Trúc Thư Mục Chính

```
src/
├── app/                  # App Router
│   ├── (admin)/          # Admin routes (/admin/*)
│   ├── (auth)/           # Authentication routes (/login, /register)
│   ├── (user)/           # User routes (/, /movies, /booking, etc.)
│   └── api/              # Internal API routes (if any)
├── components/           # Reusable React components
│   ├── admin/            # Admin specific components
│   ├── common/           # Shared components (Button, Input, Modal, etc.)
│   ├── layout/           # Layout components (Navbar, Footer, Sidebar)
│   └── movie/            # Movie specific components
├── lib/                  # Utilities and API clients
│   ├── api/              # API methods grouped by functionality
│   └── auth/             # Auth helpers (storage, context)
└── types/                # TypeScript type definitions
```

## 📝 Ghi Chú
-   Dự án sử dụng mô hình xác thực dựa trên Token (lưu trong Cookie/LocalStorage).
-   Vui lòng đảm bảo Backend API đang chạy để fetch dữ liệu thành công.

---
**Developed by [QNT]**
