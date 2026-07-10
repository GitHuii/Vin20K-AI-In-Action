# Ngày 1 — Bài Tập & Phản Ánh
## Nền Tảng LLM API | Phiếu Thực Hành

**Thời lượng:** 1:30 giờ  
**Cấu trúc:** Lập trình cốt lõi (60 phút) → Bài tập mở rộng (30 phút)

---

## Phần 1 — Lập Trình Cốt Lõi (0:00–1:00)

Chạy các ví dụ trong Google Colab tại: https://colab.research.google.com/drive/172zCiXpLr1FEXMRCAbmZoqTrKiSkUERm?usp=sharing

Triển khai tất cả TODO trong `template.py`. Chạy `pytest tests/` để kiểm tra tiến độ.

**Điểm kiểm tra:** Sau khi hoàn thành 4 nhiệm vụ, chạy:
```bash
python template.py
```
Bạn sẽ thấy output so sánh phản hồi của GPT-4o và GPT-4o-mini.

---

## Phần 2 — Bài Tập Mở Rộng (1:00–1:30)

### Bài tập 2.1 — Độ Nhạy Của Temperature
Gọi `call_openai` với các giá trị temperature 0.0, 0.5, 1.0 và 1.5 sử dụng prompt **"Hãy kể cho tôi một sự thật thú vị về Việt Nam."**

- **Temperature 0.0 & 0.5**: Phản hồi mang tính nhất quán, cấu trúc chặt chẽ, chính xác và dễ đoán.
- **Temperature 1.0**: Câu trả lời bắt đầu phong phú và đa dạng hơn về mặt ngôn từ, có tính sáng tạo cao hơn.
- **Temperature 1.5**: Phản hồi trở nên kém ổn định, câu chữ lộn xộn, có thể lặp từ vô nghĩa hoặc đưa ra thông tin sai lệch (hallucination).

**Bạn sẽ đặt temperature bao nhiêu cho chatbot hỗ trợ khách hàng, và tại sao?**
> Tôi sẽ thiết lập **temperature từ 0.0 đến 0.2** (tốt nhất là 0.0). Vì đối với dịch vụ hỗ trợ khách hàng, tính chính xác và nhất quán của thông tin (chính sách, giá cả, quy trình) là tối quan trọng. Việc giữ temperature thấp giúp giảm thiểu tối đa hiện tượng "ảo tưởng" (hallucination) và đảm bảo các câu trả lời luôn đồng nhất cho cùng một câu hỏi của khách hàng.

---

### Bài tập 2.2 — Đánh Đổi Chi Phí
Xem xét kịch bản: 10.000 người dùng hoạt động mỗi ngày, mỗi người thực hiện 3 lần gọi API, mỗi lần trung bình ~350 token.

**Ước tính xem GPT-4o đắt hơn GPT-4o-mini bao nhiêu lần cho workload này:**
> - Tổng số token đầu ra mỗi ngày: \(10.000 \times 3 \times 350 = 10.500.000\) tokens (10.500 nghìn tokens).
> - Chi phí với GPT-4o: \(10.500 \times \$0,010 = \$105,00\) mỗi ngày.
> - Chi phí với GPT-4o-mini: \(10.500 \times \$0,0006 = \$6,30\) mỗi ngày.
> - **Tỷ lệ chênh lệch**: GPT-4o đắt hơn GPT-4o-mini đúng **16.67 lần** (\(0.010 / 0.0006 = 16.67\)).

**Mô tả một trường hợp mà chi phí cao hơn của GPT-4o là xứng đáng, và một trường hợp GPT-4o-mini là lựa chọn tốt hơn:**
> - **GPT-4o xứng đáng**: Khi ứng dụng yêu cầu khả năng suy luận logic phức tạp, viết hoặc sửa lỗi code, phân tích ngữ cảnh dài và sâu sắc, hoặc trích xuất dữ liệu có cấu trúc yêu cầu độ chính xác tuyệt đối.
> - **GPT-4o-mini tốt hơn**: Khi xây dựng các ứng dụng có tần suất gọi API lớn nhưng tác vụ đơn giản như: tóm tắt văn bản ngắn, phân tích sắc thái cảm xúc (sentiment analysis), phân loại ý định người dùng (intent classification), hoặc chatbot trả lời các câu hỏi FAQ có sẵn.

---

**Streaming quan trọng nhất trong trường hợp nào, và khi nào thì non-streaming lại phù hợp hơn?** (1 đoạn văn)
> - **Streaming** quan trọng nhất trong các ứng dụng chatbot hội thoại tương tác trực tiếp với người dùng cuối (như ChatGPT, trợ lý ảo). Cơ chế này giúp hiển thị kết quả ngay lập tức khi LLM vừa sinh ra token đầu tiên (giảm Perceived Latency/TTFT), mang lại cảm giác phản hồi tự nhiên và giữ chân người dùng tốt hơn.
> - **Non-streaming** phù hợp hơn cho các tác vụ xử lý ngầm (background jobs), giao tiếp hệ thống qua API, xử lý hàng loạt (batch processing), hoặc khi cần gọi hàm (function calling/tool use) và trả về định dạng JSON được xác thực đầy đủ trước khi thực hiện các logic tiếp theo ở phía backend.


## Danh Sách Kiểm Tra Nộp Bài
- [ ] Tất cả tests pass: `pytest tests/ -v`
- [ ] `call_openai` đã triển khai và kiểm thử
- [ ] `call_openai_mini` đã triển khai và kiểm thử
- [ ] `compare_models` đã triển khai và kiểm thử
- [ ] `streaming_chatbot` đã triển khai và kiểm thử
- [ ] `retry_with_backoff` đã triển khai và kiểm thử
- [ ] `batch_compare` đã triển khai và kiểm thử
- [ ] `format_comparison_table` đã triển khai và kiểm thử
- [ ] `exercises.md` đã điền đầy đủ
- [ ] Sao chép bài làm vào folder `solution` và đặt tên theo quy định 
