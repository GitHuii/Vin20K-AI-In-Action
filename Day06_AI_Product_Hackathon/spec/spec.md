# Đặc tả sản phẩm (SPEC) — MoMo Moni (AI-Powered Financial Assistant)

## 1. Bằng chứng (Evidence)
Nỗi đau (pain point) của người dùng khi sử dụng trợ lý chi tiêu tự động được chứng minh qua các nguồn sau:

- **Trải nghiệm trực tiếp (Self-use)**: Khi thực hiện chuyển khoản P2P cho bạn bè qua MoMo kèm tin nhắn như `"tiền ăn trưa bún chả"`, hệ thống tự động gán nhãn giao dịch là `"Chuyển tiền"` (nhãn mặc định cho mọi giao dịch P2P). Kết quả là cuối tháng, biểu đồ chi tiêu sinh hoạt không phản ánh đúng thực tế, khiến người dùng phải ngồi chỉnh sửa thủ công từng giao dịch.
- **Quan sát bên ngoài (External Evidence)**: Qua khảo sát các nhóm người dùng ví điện tử MoMo, đa số phản nàn rằng việc thống kê chi tiêu tự động chưa thông minh. AI không phân tích được nội dung tin nhắn chuyển tiền mặc dù người dùng ghi rất rõ ràng. Đặc biệt, sau khi người dùng sửa đổi nhãn giao dịch, hệ thống không ghi nhớ (thiếu feedback loop), dẫn đến các giao dịch sau vẫn bị gán nhãn sai.

## 2. Lát cắt để build (Build slice)
Lát cắt tối giản (MVP) được thiết kế và demo trong bài Hackathon này là:
> **Cho một người dùng thực hiện chuyển khoản MoMo P2P cho bạn bè kèm lời nhắn, hệ thống sử dụng AI để tự động phân tích ngữ nghĩa lời nhắn nhằm gán nhãn chi tiêu phù hợp (Ăn uống, Mua sắm, Học tập...). Nếu độ tin cậy thấp, hệ thống sẽ hỏi lại (Low-confidence). Nếu AI gán nhãn sai, người dùng có thể sửa đổi và hệ thống sẽ tự động học quy luật mới (Feedback Loop) để áp dụng chính xác cho các giao dịch tương tự sau này.**

## 3. AI Product Canvas

| Ô | Đặc tả nội dung |
|---|---|
| **Value (Giá trị)** | **Đối tượng**: Học sinh, sinh viên và nhân viên văn phòng bận rộn thường xuyên chia tiền ăn uống/mua sắm qua QR/chuyển khoản P2P.<br>**Nỗi đau**: Mất thời gian ghi chép thủ công; biểu đồ tự động bị lệch do giao dịch P2P bị gom vào mục "Chuyển tiền".<br>**AI giải quyết**: Tự động phân loại danh mục dựa trên phân tích ngôn ngữ tự nhiên từ tin nhắn giao dịch, tiết kiệm 95% thời gian quản lý tài chính. |
| **Trust (Niềm tin)** | **Xử lý sai sót**: Khi AI phân loại sai, nhãn sai được hiển thị kèm theo tùy chọn chỉnh sửa nhanh (1-click) ngay tại danh sách lịch sử giao dịch.<br>**Phục hồi**: Cho phép hoàn tác (Undo) và hiển thị cảnh báo rõ ràng khi số liệu thay đổi đột ngột. |
| **Feasibility (Khả thi)** | **Kỹ thuật**: Sử dụng API của mô hình **gemini-3.1-flash-lite** gọi trực tiếp qua REST API bằng JavaScript bất đồng bộ (async/await).<br>**Chi phí & Bảo mật**: Khóa API Key được cấu hình trên client-side và lưu trữ an toàn trong LocalStorage của trình duyệt của người dùng (không push lên GitHub). Có cơ chế **AI Cục bộ (Regex Fallback)** tự động kích hoạt khi mất kết nối hoặc không có key để đảm bảo tính ổn định tuyệt đối lúc demo. |
| **Tín hiệu học (Learning Loop)** | **Feedback Loop**: Khi người dùng sửa nhãn của giao dịch `A` từ danh mục `X` sang `Y`, hệ thống sẽ lưu quy tắc cá nhân hóa: `(Người nhận A + Từ khóa tương tự) -> Danh mục Y`. Quy tắc này được lưu vào LocalStorage và cập nhật vào bộ phân loại cá nhân. |

## 4. Tăng năng lực hay tự động hóa (Auto/Aug decision)
- **Hình thức chọn**: **Conditional Automation** (Tự động hóa có điều kiện).
- **Lý do**:
  - Đối với các giao dịch có độ tự tin cao (chứa từ khóa rõ ràng như `"bún chả"`, `"sách giáo khoa"`), AI tự động gán nhãn để giảm thiểu thao tác của người dùng.
  - Đối với các giao dịch mơ hồ (chỉ ghi tên người nhận hoặc nội dung không rõ ràng như `"gửi anh"`), AI không tự ý gán nhãn mà hiển thị card gợi ý xác nhận nhanh (Augmentation).
- **Vai trò con người**: Người phê duyệt (khi AI phân vân) và Người huấn luyện (khi sửa nhãn sai để AI học lại).

## 5. Bốn đường đi của trải nghiệm (Four paths)

| Đường đi | Kịch bản trải nghiệm trong Prototype |
|----------|---------------------------------------|
| **Happy (Đường thuận)** | Người dùng nhập lời nhắn: `"tiền bún chả trưa nay"` -> AI nhận diện độ tự tin cao -> Tự động xếp vào danh mục **Ăn uống** (Hiển thị tag màu hồng đặc trưng). |
| **Low-confidence (Không chắc)** | Người dùng nhập lời nhắn: `"gửi Nam"` hoặc `"chuyển khoản"` -> AI nhận diện độ tự tin thấp -> Hiện card tương tác hỏi: *"Giao dịch này dùng cho mục đích gì?"* kèm 3 lựa chọn gợi ý nhanh: `[Ăn uống]` `[Chuyển tiền]` `[Mua sắm]`. |
| **Failure (AI gán nhãn sai)** | Người dùng nhập lời nhắn: `"mua hộ cuốn sách"` -> AI hiểu sai ngữ cảnh gán nhãn thành **Mua sắm** -> Người dùng thấy nhãn sai trong lịch sử giao dịch, click vào nhãn và chọn đổi thành **Học tập**. |
| **Correction (Học lại)** | Sau khi người dùng sửa giao dịch trên, hệ thống ghi nhận luật mới. Lần sau người dùng chuyển tiền cho cùng người nhận đó với nội dung `"sách cho Nam"` -> AI tự động phân loại chính xác thành **Học tập** dựa trên quy tắc đã học. |

## 6. Những kiểu lỗi đáng lo nhất (Failure modes)
1. **AI phân loại sai thành danh mục nhạy cảm**: Giao dịch ăn uống bình thường bị phân loại thành `"Trả nợ"` hoặc `"Đầu tư"`, gây hoang mang cho người dùng khi xem biểu đồ tài chính.
   - *Cách xử lý*: Cung cấp nút `Undo` nhanh ngay trên thông báo biến động số dư và cho phép sửa đổi 1-click.
2. **Spam/Nội dung vô nghĩa**: Người dùng ghi lời nhắn trêu đùa như `"đòi nợ máu"`, `"trả tiền giang hồ"`.
   - *Cách xử lý*: Hệ thống tự động phát hiện các từ khóa ngoài phạm vi tài chính thông thường để chuyển về danh mục mặc định `"Chuyển tiền"` thay vì cố gắng phân loại bừa bãi.

## 7. Kế hoạch kiểm thử và bằng chứng demo

### Bộ dữ liệu kiểm thử
Chúng ta chuẩn bị sẵn các câu test case sau để chạy trực tiếp trên prototype:
- **Test case 1 (Happy - Ăn uống)**: `"tiền bánh mì và trà sữa"` -> Kỳ vọng: **Ăn uống**
- **Test case 2 (Happy - Mua sắm)**: `"mua cái áo phông"` -> Kỳ vọng: **Mua sắm**
- **Test case 3 (Low confidence)**: `"gửi bạn học"` -> Kỳ vọng: Hiển thị card lựa chọn mục đích.
- **Test case 4 (Failure -> Correction)**: `"mua hộ sách lập trình"` -> Ban đầu xếp vào **Mua sắm** -> Sửa thành **Học tập** -> Giao dịch tiếp theo `"sách toán học"` -> Tự động xếp vào **Học tập**.

### Chatbot AI Test
- Thực hiện hỏi chatbot: `"Tháng này mình tiêu bao nhiêu tiền ăn rồi?"` -> Chatbot phải truy vấn cơ sở dữ liệu giao dịch thực tế đã qua xử lý của Feedback Loop để đưa ra con số chính xác.

### Kiểm thử tích hợp Gemini API thật (Vượt qua điều kiện chặn)
- **Kiểm thử kết nối**: Nhập Gemini API Key vào panel cấu hình trên giao diện -> Xác nhận trạng thái kết nối chuyển sang màu xanh: `"Gemini API Thật (Đã kết nối)"`.
- **Kiểm thử Phân loại & Chatbot**: Gửi giao dịch bất kỳ và chat với chatbot để kiểm tra logs hoạt động trên terminal (màu hồng) chứng minh cuộc gọi HTTP thực tế đến mô hình `gemini-3.1-flash-lite`.

## 8. Phân công (Ownership)
- **Học viên (Bạn)**: Nghiên cứu trải nghiệm người dùng, xây dựng các test case kiểm thử và thiết lập kịch bản demo.
- **Antigravity (AI)**: Thực hiện viết tài liệu SPEC và phát triển mã nguồn Web Prototype (giao diện ví MoMo Moni giả lập, logic phân loại tin nhắn P2P, cơ chế Feedback Loop và giả lập chatbot).
