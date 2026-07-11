# Workshop — Mổ App AI Thật

**Thời gian:** 35-45 phút  
**Hình thức:** cá nhân trước, chia sẻ theo nhóm sau  
**Output:** finding note + sketch `as-is / to-be`

Mục tiêu không phải chấm "UI đẹp hay xấu". Mục tiêu là dùng sản phẩm thật như một bài needfinding: tìm chỗ product gãy trong workflow thật, rồi viết finding đó thành quyết định product.

## 1. Chọn một sản phẩm để dùng thử

* **Sản phẩm:** MoMo — Moni
* **AI feature:** Trợ thủ tài chính, phân tích chi tiêu, chatbot giải đáp thắc mắc tài chính.

## 2. Dùng thử: promise vs reality

* **Product hứa gì?** Tự động ghi chép, phân loại giao dịch chính xác mà không cần người dùng nhập tay, giúp theo dõi và tối ưu hóa chi tiêu thông minh.
* **User nào được hứa sẽ được giúp?** Những người trẻ bận rộn, sử dụng MoMo làm ví chính để tiêu dùng hàng ngày nhưng lười ghi chép chi tiêu thủ công.
* **Bạn kỳ vọng AI làm được task nào?** Tự động nhận diện ngữ cảnh chuyển khoản (P2P) để phân loại đúng danh mục (ví dụ: chuyển khoản cho bạn bè ghi "tiền bánh mì" -> tự hiểu là "Ăn uống"). Chatbot trả lời chính xác tổng chi tiêu của từng danh mục khi được hỏi.
* **Khi dùng thật, điểm gãy xuất hiện ở đâu?** Giao dịch chuyển khoản cá nhân P2P mặc định bị phân vào danh mục "Chuyển tiền" thay vì "Ăn uống/Mua sắm". Khi hỏi chat "Tháng này tôi tiêu bao nhiêu tiền ăn?", kết quả bị sai lệch nghiêm trọng.
* **Evidence cần có:**
  * **Input/Prompt đã thử:** Chuyển khoản 100,000đ cho bạn với lời nhắn "Tien an trua nay nha".
  * **Hành vi quan sát được:** Moni phân loại giao dịch này vào mục "Chuyển tiền" (không tính vào chi phí sinh hoạt).
  * **Prompt chatbot:** "Tháng này mình tiêu bao nhiêu tiền ăn uống rồi Moni?"
  * **Phản hồi của AI:** "Tháng này bạn đã tiêu 250k cho Ăn uống." (Thực tế là 1.5M do có 1.25M chuyển khoản ăn chung với bạn bè bị xếp vào "Chuyển tiền").

## 3. Vẽ 4 paths

| Path | Câu hỏi cần trả lời | Trạng thái thực tế trên MoMo Moni |
|---|---|---|
| **Happy** | Khi AI đúng và tự tin, user thấy gì? | User quét mã QR thanh toán tại cửa hàng (ví dụ: Highlands Coffee) -> AI tự tin phân loại chính xác là "Ăn uống" -> Số liệu cập nhật đúng vào biểu đồ. |
| **Low-confidence** | Khi AI không chắc, hệ thống có hỏi lại, show options hoặc chuyển người không? | Khi user chuyển khoản P2P kèm tin nhắn "an trua" -> AI phân vân giữa "Chuyển tiền" và "Ăn uống" -> **Thực tế:** Moni mặc định xếp vào "Chuyển tiền" mà không hỏi lại hay xác nhận với user. |
| **Failure** | Khi AI sai, user biết bằng cách nào và sửa thế nào? | User phát hiện khi thấy số liệu tổng hợp trong biểu đồ hoặc chatbot trả lời sai -> Sửa bằng cách vào lịch sử giao dịch Moni, click chọn từng giao dịch để đổi danh mục thủ công. |
| **Correction** | Khi user sửa, correction có được lưu/log/học lại không hay biến mất? | **Thực tế:** Việc sửa đổi chỉ cập nhật cứng vào cơ sở dữ liệu của giao dịch đó. AI **hoàn toàn không học lại** quy luật này -> Giao dịch chuyển tiền tiếp theo cho cùng người bạn đó vẫn bị xếp sai vào "Chuyển tiền". |

## 4. Viết finding thành quyết định

```text
Khi user chuyển khoản P2P ăn chung và ghi nội dung rõ ràng (ví dụ: "tiền ăn trưa"),
AI/product tự động xếp vào danh mục mặc định "Chuyển tiền" và không tự động học từ các lần sửa trước đó của user,
hậu quả là báo cáo chi tiêu và câu trả lời của chatbot bị sai lệch lớn, làm mất lòng tin của user vào số liệu tự động.
Lỗi thuộc layer: Intent + Data-tool + UX Recovery.
Nên sửa bằng:
- UX Recovery: Thêm nút gợi ý xác nhận nhanh (ví dụ: "Có phải Ăn uống không?") đối với các giao dịch P2P chứa từ khóa nhạy cảm.
- Correction Path (Feedback loop): Lưu lại lịch sử sửa đổi của user để cá nhân hóa mô hình phân loại (Personalized Classifier) cho các giao dịch tương lai với cùng một tài khoản nhận.
```

## 5. Sketch as-is / to-be

* **As-is Flow (Luồng hiện tại):**
  `Chuyển tiền ăn cho bạn` -> `AI tự động phân loại "Chuyển tiền"` -> `User hỏi chatbot` -> `AI trả lời sai số liệu` -> `User phải mò tìm từng giao dịch để sửa tay` -> `Lần sau vẫn bị lỗi tương tự`.

* **To-be Flow (Luồng đề xuất):**
  `Chuyển tiền ăn cho bạn (kèm chữ "ăn trưa")` -> `AI nghi ngờ "Ăn uống" (độ tự tin thấp)` -> `Moni gửi thông báo/card hỏi: "Đây có phải tiền Ăn uống không?"` -> `User nhấn "Đúng"` -> `AI đổi nhãn thành "Ăn uống" và ghi nhớ quy luật này cho lần sau`.

## 6. Tự kiểm trước khi nộp

- [x] Có ít nhất 1 screenshot hoặc observation cụ thể. (Đã mô tả observation chi tiết)
- [x] Có đủ 4 paths hoặc nói rõ path nào chưa có trong product. (Đã phân tích đủ 4 paths)
- [x] Finding được viết thành product decision, không chỉ là nhận xét. (Đã viết dạng Product Decision)
- [x] Sketch có as-is và to-be. (Đã mô tả chi tiết As-is và To-be flow)
- [x] Có một câu nói rõ finding này sẽ đổi gì trong SPEC.
  * *Câu chốt:* Finding này thay đổi SPEC bằng cách: Thêm yêu cầu kỹ thuật về việc lưu trữ nhãn chỉnh sửa của user làm dữ liệu huấn luyện cá nhân hóa (Personalized feedback loop) và định nghĩa thêm luồng giao diện Low-confidence cho Chatbot để xác nhận lại danh mục giao dịch đáng nghi vấn.
