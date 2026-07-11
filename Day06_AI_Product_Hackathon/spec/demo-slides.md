# SLIDE 1: GIỚI THIỆU CHUNG
## MONI AI — Trợ Thủ Tài Chính Thông Minh Cho Giao Dịch P2P Trên Ví MoMo

* **Bối cảnh**: Buổi thuyết trình Hackathon Day 06 — AI Thực Chiến (Lớp Batch 02)
* **Thành viên nhóm**:
  1. [Mã học viên 1] — [Họ và tên 1] (Thuyết trình & Demo)
  2. [Mã học viên 2] — [Họ và tên 2] (Nghiên cứu & Thiết kế slide)
  3. [Mã học viên 3] — [Họ và tên 3] (Phát triển codebase)
* **Thông điệp cốt lõi**: Biến các tin nhắn chuyển khoản P2P khô khan thành dữ liệu tài chính sạch và cá nhân hóa tự động.

---

# SLIDE 2: NỖI ĐAU CỦA NGƯỜI DÙNG & BẰNG CHỨNG
## Tại sao hệ thống quản lý chi tiêu tự động hiện tại bị "gãy"?

* **Nỗi đau thực tế**:
  * Người dùng trẻ thường xuyên chuyển khoản P2P ăn chung, mua hộ (ví dụ quét QR chia tiền bún chả, cà phê).
  * 100% giao dịch này bị MoMo mặc định phân loại vào mục **"Chuyển tiền"** thay vì **"Ăn uống"** hay **"Mua sắm"**.
* **Bằng chứng (Evidence)**:
  * Trải nghiệm trực tiếp: Chuyển khoản 100k ghi *"tiền lẩu"* -> Biểu đồ chi tiêu không ghi nhận *"Ăn uống"*.
  * Phản hồi cộng đồng: Người dùng tốn hàng giờ mỗi cuối tháng để phân loại lại thủ công.
  * Hệ thống thiếu **Feedback Loop**: Người dùng sửa xong, lần sau chuyển tiền cùng cú pháp vẫn bị phân loại sai.

---

# SLIDE 3: GIẢI PHÁP - MONI AI PROTOTYPE
## Tăng năng lực quản lý tài chính với AI cá nhân hóa

* **Lát cắt sản phẩm (Build Slice)**:
  * Đọc hiểu lời nhắn chuyển tiền P2P bằng bộ phân tích NLP/Từ khóa thông minh.
  * Tự động gán nhãn chính xác khi độ tự tin cao.
* **Mô hình AI Product Canvas**:
  * **Value**: Tiết kiệm 95% thời gian ghi chép thủ công.
  * **Trust**: Cho phép hoàn tác (Undo) 1-click và sửa nhãn nhanh.
  * **Learning Loop**: Lưu vết chỉnh sửa của người dùng vào LocalStorage làm dữ liệu huấn luyện cá nhân hóa (Personalized Rules).

---

# SLIDE 4: THIẾT KẾ TRẢI NGHIỆM (4 PATHS)
## AI tương tác thông minh theo mức độ tự tin

* **Happy Path (Độ tự tin cao)**:
  * Tin nhắn *"tiền ăn trưa bún chả"* -> AI tự động phân loại **Ăn uống** (tag màu hồng).
* **Low-confidence Path (Độ tự tin thấp)**:
  * Tin nhắn *"gửi anh Nam"* -> Hiện popup hỏi mục đích kèm các nút gợi ý nhanh `[Ăn uống]`, `[Mua sắm]`.
* **Failure Path (AI đoán sai)**:
  * Tin nhắn *"mua hộ cuốn sách"* -> AI đoán sai thành **Mua sắm** -> User click sửa thành **Học tập**.
* **Correction Path (Học tập)**:
  * AI ghi nhớ quy tắc. Lần sau nhập *"sách toán cho Nam"* -> AI tự động phân loại đúng là **Học tập**.

---

# SLIDE 5: GIÁ TRỊ CỐT LÕI & TẦM NHÌN
## Khi dữ liệu sạch làm bệ phóng cho Chatbot AI

* **Kết quả đạt được**:
  * Chuyển từ **Tự động hóa hoàn toàn** (dễ sai sót) sang **Tự động hóa có điều kiện** (Conditional Automation).
  * Quy tắc cá nhân hóa giúp AI càng dùng càng thông minh và cá nhân hóa theo từng người dùng.
* **Chatbot AI tích hợp**:
  * Đọc trực tiếp cơ sở dữ liệu đã qua xử lý của Feedback Loop.
  * Trả lời chính xác câu hỏi: *"Tháng này mình tiêu bao nhiêu tiền ăn rồi Moni?"* (Số liệu khớp 100% thực tế nhờ bao gồm cả giao dịch P2P đã sửa nhãn).
