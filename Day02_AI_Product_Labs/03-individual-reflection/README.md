# 03 — Individual Reflection (Tự đánh giá cá nhân)

*Học viên: [Điền Họ và Tên]*  
*Mã học viên: [Điền Mã Học Viên]*

---

## 1. Vai trò và đóng góp của bạn trong nhóm
- Đóng vai trò là thành viên đề xuất và phản biện chính trong nhóm.
- Đã đóng góp 3 vấn đề cá nhân sát sườn: dọn dẹp thư mục lab, gán nhãn captcha, và hạn chế phần cứng local yếu.
- Phối hợp cùng Lâm (thành viên AI) để thảo luận phân tích, đánh giá độ khả thi kỹ thuật của từng vấn đề, từ đó thống nhất chọn đề tài tối ưu nhất cho nhóm là "Tự động gán nhãn Captcha UNETI".

## 2. Cách bạn sử dụng AI trong quá trình làm bài Lab này
- Sử dụng trợ lý AI (Antigravity) để hỗ trợ rà soát các project có sẵn trên Desktop nhằm phát hiện và gọi tên chính xác các bottleneck thực tế (như gán nhãn captcha, train local yếu).
- Dùng AI để phản biện nhanh các ý tưởng cá nhân và hỗ trợ thiết lập khung bài làm nhóm (vẽ sơ đồ Mermaid, soạn Problem Statement).
- Luôn giữ vai trò kiểm chứng: đọc lại các câu trả lời và chỉnh sửa các tham số/logic mà AI đề xuất để đảm bảo đúng với thực tế học tập và nghiên cứu của mình.

## 3. Bài học lớn nhất rút ra sau bài Lab
- Thấm nhuần tư duy **"Problem-First, not AI-First"**: Không phải cứ thấy vấn đề là đè AI ra giải quyết. Những vấn đề đơn giản như dọn dẹp môi trường nộp bài lab hoàn toàn có thể dùng script thông thường (Rule-based) để xử lý nhanh và tin cậy hơn.
- Khi đưa AI vào quy trình, việc thiết lập **Ranh giới an toàn (Human Boundary)** là bắt buộc để con người kiểm soát chất lượng đầu ra cuối cùng, tránh hiện tượng dữ liệu rác làm hỏng mô hình (data poisoning).
- Hệ thống AI luôn có xác suất lỗi, vì vậy luôn cần có phương án **Fallback (dự phòng)** rõ ràng để quy trình không bị tắc nghẽn.

## 4. Nếu được làm lại từ đầu, bạn sẽ thay đổi điều gì?
- Mình sẽ chủ động đi khảo sát ý kiến hoặc phỏng vấn thêm các bạn cùng lớp/nhóm nghiên cứu khác về quy trình gán nhãn dữ liệu của họ, nhằm thu thập thêm nhiều bằng chứng thực tế hơn (validation evidence) cho Problem Statement của nhóm thêm chặt chẽ.

---

## 5. Trắc nghiệm kiểm tra mức độ hiểu bài (Self-Check Quiz)

*Hãy trả lời ngắn gọn các câu hỏi sau để xác nhận bạn đã nắm vững kiến thức cốt lõi:*

1. **Tại sao "Problem First, not AI First" là nguyên tắc quan trọng nhất khi thiết kế sản phẩm AI?**
   *Trả lời:* Vì nếu bắt đầu từ AI, chúng ta dễ rơi vào bẫy xây dựng những giải pháp công nghệ phức tạp, đắt đỏ nhưng không giải quyết đúng nhu cầu thực tế của người dùng, hoặc chọn nhầm những bài toán vốn chỉ cần giải pháp đơn giản hơn không dùng AI (như script/rule-based).
   
2. **Boundary (Ranh giới) trong một workflow AI đóng vai trò gì? Cho một ví dụ về boundary.**
   *Trả lời:* Đóng vai trò đảm bảo AI hoạt động trong tầm kiểm soát an toàn của con người, ngăn ngừa sai sót hoặc ảo tưởng (hallucination) của AI ảnh hưởng trực tiếp đến kết quả cuối. Ví dụ: AI chỉ được phép gán nhãn nháp (pre-label), con người bắt buộc phải kiểm duyệt và chỉnh sửa trước khi đưa vào tập dữ liệu huấn luyện chính thức.
   
3. **Sự khác biệt cơ bản giữa cấu hình AI dạng "Workflow" và "Agent" là gì? Khi nào nên chọn Workflow thay vì Agent?**
   *Trả lời:* Workflow là chuỗi các bước được định nghĩa sẵn có tính chất tuyến tính, đầu vào và đầu ra rõ ràng, tính ổn định và kiểm soát cao. Agent là hệ thống tự chủ cao hơn, tự lập kế hoạch và ra quyết định dựa trên mục tiêu chung. Nên chọn Workflow khi quy trình có cấu trúc rõ ràng, đòi hỏi độ chính xác ổn định và chi phí phát triển thấp.
   
4. **Tại sao cần có phương án Fallback (dự phòng) khi thiết kế hệ thống có sử dụng AI?**
   *Trả lời:* Vì AI không bao giờ đạt độ chính xác 100% và các dịch vụ API/mô hình AI có thể gặp sự cố (timeout, nghẽn mạng, hết quota). Phương án Fallback đảm bảo công việc của con người không bị dừng đột ngột mà vẫn có phương án dự phòng thủ công hoặc offline để thay thế.
