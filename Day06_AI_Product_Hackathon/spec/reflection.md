# Bài viết thu hoạch cá nhân (Personal Reflection) — Day 06 Hackathon

* **Học viên**: [Họ và tên của bạn]
* **Mã học viên**: [Mã học viên của bạn]
* **Đề tài nhóm**: MoMo Moni — Trợ lý tài chính cá nhân thông minh (Tối ưu hóa phân loại giao dịch P2P & Feedback Loop)

---

## 1. Bài học lớn nhất về Tư duy Sản phẩm AI (AI Product Thinking)
Trước khi tham gia bài thực hành này, tôi luôn nghĩ xây dựng sản phẩm AI là phải huấn luyện mô hình thật to hoặc tìm cách gọi API cho mọi tác vụ để hệ thống tự động hóa hoàn toàn. Nhưng bài Lab 5 và 6 đã thay đổi hoàn toàn tư duy của tôi:

* **Sản phẩm AI quan trọng ở UX/Trải nghiệm, không chỉ ở Tech**: Một mô hình AI dù chính xác đến 90% vẫn sẽ có 10% sai sót. Nếu không thiết kế tốt các con đường phục hồi khi AI sai (Failure & Correction Path), người dùng sẽ cảm thấy ức chế và rời bỏ sản phẩm.
* **Tầm quan trọng của Conditional Automation (Tự động hóa có điều kiện)**: Thay vì cố gắng bắt AI tự động quyết định 100% các giao dịch P2P mơ hồ (dễ gây lệch số liệu biểu đồ chi tiêu), việc thiết kế màn hình hỏi nhanh (Low-confidence path) giúp tăng độ tin cậy của ứng dụng và sự gắn kết của người dùng.
* **Feedback Loop là linh hồn của AI**: Khi người dùng sửa nhãn giao dịch bị sai, hành động đó không chỉ là sửa dữ liệu tĩnh mà là cơ hội để AI học hỏi quy luật cá nhân hóa. Cơ chế học tập liên tục (Learning Loop) giúp sản phẩm ngày càng thông minh hơn theo thời gian sử dụng của từng cá nhân.

## 2. Kỹ năng thực chiến và Đánh đổi kỹ thuật (Technical Trade-offs)
Quá trình xây dựng Prototype MoMo Moni đã dạy tôi cách đưa ra quyết định thực tế về mặt kỹ thuật:

* **Độ trễ và Chi phí**: Tôi nhận ra không thể gọi API mô hình lớn cho mọi giao dịch vì chi phí cao và độ trễ lớn sẽ làm hỏng trải nghiệm thanh toán thời gian thực (realtime). Do đó, việc kết hợp giữa bộ lọc Regex/Rule local (để xử lý nhanh các cú pháp quen thuộc với độ trễ <50ms) và gọi API LLM thật (`gemini-3.1-flash-lite`) cho các ngữ cảnh phức tạp là một sự đánh đổi kiến trúc rất thực tế và khôn ngoan.
* **Tập trung vào Lát cắt nhỏ nhất (Build Slice)**: Thay vì làm một ứng dụng tài chính đồ sộ nhưng không có gì nổi bật, việc tập trung giải quyết triệt để nỗi đau gán nhãn sai của giao dịch chuyển khoản P2P ăn chung đã giúp nhóm có một demo cực kỳ sắc bén và thuyết phục.

## 3. Trải nghiệm làm việc nhóm và Phối hợp cùng AI
* **Làm việc nhóm**: Buổi Hackathon đòi hỏi sự phối hợp nhịp nhàng dưới áp lực thời gian. Việc phân công rõ ràng vai trò (người chuẩn bị bằng chứng thực tế, người viết kịch bản thuyết trình, người lập trình prototype) giúp nhóm hoàn thành đúng các mốc Checkpoint.
* **Phối hợp cùng Trợ lý AI**: Việc sử dụng trợ lý AI (Antigravity) làm người bạn đồng hành lập trình (pair programmer) mang lại hiệu quả đáng kinh ngạc. Tôi đóng vai trò định hướng sản phẩm, đặt câu hỏi phản biện và chuẩn bị các kịch bản kiểm thử thực tế, trong khi AI hỗ trợ hiện thực hóa nhanh chóng ý tưởng thành mã nguồn chạy được và soạn thảo SPEC. Đây chính là mô hình cộng tác "Human-in-the-loop" hiệu quả nhất.
