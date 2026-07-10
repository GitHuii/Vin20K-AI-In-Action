# Quy tắc làm việc với dự án Vin20K-AI-In-Action

Dự án này được dùng để lưu trữ và thực hiện các bài thực hành (Lab) trong khóa học "AI thực chiến" của VinGroup.

## 1. Quy tắc cấu trúc thư mục
- Mỗi ngày học tương ứng với 1 bài Lab và được đặt trong một thư mục riêng biệt ở thư mục gốc.
- Định dạng đặt tên thư mục: `DayXX_Ten_Bai_Lab`
  - `XX`: Số thứ tự ngày học, luôn có 2 chữ số (ví dụ: `01`, `02`, `10`).
  - `Ten_Bai_Lab`: Viết hoa chữ cái đầu của mỗi từ (Title Case), các từ nối với nhau bằng dấu gạch dưới `_`. Tên này được lấy trực tiếp dựa trên tên repository GitHub tương ứng (ví dụ: từ repository `Day01-lab-assignment` sẽ được chuyển thành thư mục `Day01_Lab_Assignment`). Trợ lý AI không được tự đặt tên khác.
  - Ví dụ hợp lệ: `Day01_Lab_Assignment`.
- Tuyệt đối không tạo các file code hoặc dữ liệu tự do ở thư mục gốc (root). Mọi tài nguyên của Lab nào phải nằm trọn vẹn trong thư mục của Lab đó.

## 2. Quy tắc phát triển và viết code
- **Ngôn ngữ lập trình**: Sử dụng Python (file `.py` hoặc Jupyter Notebook `.ipynb` tùy theo yêu cầu của từng bài).
- **Ngôn ngữ giao tiếp & Tài liệu**: 
  - Trợ lý AI luôn sử dụng tiếng Việt khi trao đổi, phản hồi và giải thích cho người dùng.
  - Một số bài lab hoặc tài liệu đi kèm có thể sử dụng tiếng Anh, tuy nhiên trợ lý AI vẫn sẽ trao đổi bằng tiếng Việt.
  - Các giải thích về thuật toán cần đi thẳng vào bản chất và mang tính thực chiến.
  - Comment trong code và tài liệu hướng dẫn có thể viết bằng tiếng Việt hoặc tiếng Anh rõ ràng.
- **Quản lý thư viện & Môi trường**:
  - Nếu bài lab yêu cầu cài đặt thêm thư viện mới, ghi nhận lại file `requirements.txt` trong thư mục của Lab đó.
  - Ngay sau khi khởi tạo mỗi bài Lab, cần thực hiện cài đặt ngay môi trường làm việc (ví dụ: tạo môi trường ảo `.venv` và cài đặt các thư viện từ `requirements.txt` của Lab đó) trước khi viết code.
- **Quản lý Git & Dọn dẹp sau khi hoàn thành Lab**:
  - Trợ lý AI **TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ Ý CHẠY CÁC LỆNH GIT/GITHUB** (người dùng sẽ tự thực hiện thủ công tất cả các lệnh Git).
  - Sau khi hoàn thành mỗi bài Lab, người dùng sẽ yêu cầu viết `.gitignore` ở thư mục gốc (root) để chuẩn bị commit & push.
  - Sau khi push thành công, hỗ trợ người dùng dọn dẹp các tài nguyên local không cần thiết (như thư mục môi trường ảo `.venv`, cache, v.v.) để giải phóng dung lượng bộ nhớ.
- **Quy định về File Test & Sửa lỗi**:
  - Tuyệt đối không thay đổi mã nguồn của các file kiểm thử (test) hoặc file đánh giá bài làm.
  - Nếu gặp vấn đề kiểm thử không vượt qua (fail), trợ lý AI chỉ được phép sửa đổi các file mã nguồn được yêu cầu thực hiện.
  - Cần báo cáo chi tiết lý do lỗi và đề xuất phương án giải quyết cho người dùng duyệt trước khi tiến hành chỉnh sửa.

## 3. Quy tắc hỗ trợ của Trợ lý AI (Antigravity)
- Luôn kiểm tra cấu trúc thư mục hiện tại trước khi tạo mới để đảm bảo tính nhất quán.
- Khi người dùng bắt đầu một cuộc hội thoại mới, việc đầu tiên luôn là kiểm tra dự án, đọc các tài liệu/yêu cầu của bài Lab hiện tại và **TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ Ý THỰC HIỆN HAY HOÀN THÀNH TOÀN BỘ BÀI LAB** khi chưa có sự hướng dẫn từng bước từ người dùng. Trợ lý AI đóng vai trò hướng dẫn, thảo luận và cùng thực hiện với người dùng.
- Hệ thống sẽ tự động đọc file này khi bắt đầu cuộc hội thoại mới để nắm bắt ngữ cảnh dự án ngay lập tức.
