# Vin20K AI In Action (Khóa học AI Thực Chiến - VinGroup)

Repository này dùng để lưu trữ và thực hiện các bài thực hành (Lab) trong khóa học **"AI thực chiến"** của VinGroup.

## 📁 Cấu trúc thư mục dự án

Dự án được tổ chức theo từng ngày học với quy tắc đặt tên thống nhất:
```text
Vin20K-AI-In-Action/ (Thư mục gốc)
├── .agents/
│   └── AGENTS.md            # Các quy tắc làm việc dành cho Trợ lý AI (Antigravity)
├── Day01_Lab_Assignment/    # Thư mục bài học Day 01 (Lấy theo tên repo GitHub tương ứng)
│   ├── .venv/               # Môi trường ảo của riêng bài Lab này
│   ├── requirements.txt     # Các thư viện phụ thuộc của Lab
│   ├── template.py          # File code mẫu cần hoàn thiện
│   └── tests/               # Thư mục chứa các file kiểm thử bài làm
├── Day02_Ten_Bai_Lab/       # Các bài học tiếp theo...
├── .gitignore               # Cấu hình bỏ qua các file không cần thiết khi commit (Nằm ở root)
└── README.md                # Tài liệu hướng dẫn chung của dự án
```

> [!IMPORTANT]
> Mọi tài nguyên, mã nguồn hoặc dữ liệu của bài Lab nào phải nằm trọn vẹn trong thư mục của bài Lab đó. Tuyệt đối không tạo các file tự do ở thư mục gốc (root).

---

## 🛠️ Quy trình thực hiện Lab & Workflow

Để đảm bảo hiệu quả học tập và tối ưu hóa bộ nhớ thiết bị, quy trình thực hiện mỗi bài Lab sẽ tuân theo các bước sau:

1. **Khởi tạo bài Lab:** 
   - Đồng bộ hoặc clone bài Lab từ nguồn GitHub của khóa học.
   - Thư mục được đặt tên theo định dạng `DayXX_Ten_Bai_Lab` (viết hoa chữ cái đầu của mỗi từ trong tên Lab, các từ nối với nhau bằng dấu gạch dưới `_`).
   - **Xóa ngay thư mục ẩn `.git/`** bên trong thư mục bài Lab vừa clone để tránh xung đột Git (Nested Git Repository / Gitlink).
2. **Cấu hình môi trường:**
   - Tạo môi trường ảo riêng biệt cho Lab đó: `python -m venv .venv`.
   - Cài đặt đầy đủ các thư viện từ file `requirements.txt` của Lab: `pip install -r requirements.txt`.
3. **Phát triển & Viết code:**
   - Trợ lý AI hỗ trợ giải thích lý thuyết, thuật toán bằng tiếng Việt và thảo luận hướng giải quyết từng bước cùng bạn.
   - **Tuyệt đối không để AI tự động làm toàn bộ bài Lab** mà không có sự đồng ý và tương tác từng bước của bạn.
   - **Không tự ý sửa file kiểm thử:** AI tuyệt đối không sửa đổi mã nguồn của các file kiểm thử (trong thư mục `tests/` hoặc các file đánh giá bài làm). Khi chạy test bị lỗi, AI sẽ phân tích nguyên nhân và đề xuất phương án sửa lỗi trong file bài làm để bạn duyệt.
4. **Kiểm thử bài làm:**
   - Chạy lệnh kiểm thử tự động để đảm bảo các yêu cầu được đáp ứng (ví dụ: `pytest tests/ -v`).
5. **Đóng gói & Dọn dẹp:**
   - Viết hoặc cập nhật file `.gitignore` ở thư mục gốc (root) để chuẩn bị commit & push.
   - Bạn sẽ tự thực hiện thủ công tất cả các lệnh Git/GitHub (AI không can thiệp vào các lệnh Git).
   - Sau khi push thành công, dọn dẹp các tài nguyên local không cần thiết (xóa thư mục môi trường ảo `.venv`, bộ nhớ cache, v.v.) nhằm giải phóng dung lượng đĩa cứng.

---

## 🤖 Hướng dẫn dành cho Trợ lý AI (Antigravity)

* Trợ lý AI bắt buộc phải đọc file cấu hình [AGENTS.md](file:///.agents/AGENTS.md) trước khi bắt đầu hỗ trợ ở bất kỳ phiên làm việc mới nào.
* Luôn tuân thủ nghiêm ngặt các quy tắc giao tiếp bằng tiếng Việt, quy tắc cấu trúc thư mục, quy trình kiểm thử và dọn dẹp đã được thỏa thuận trong hệ thống quy tắc của dự án.
