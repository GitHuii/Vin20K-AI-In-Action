# Báo cáo Cá nhân: Lab 3 - Chatbot vs ReAct Agent

- **Họ và tên**: [Họ và Tên của bạn ở đây]
- **Mã số sinh viên**: [Mã số Sinh viên của bạn ở đây]
- **Ngày hoàn thành**: 2026-07-11

---

## I. Đóng góp Kỹ thuật (Technical Contribution - 15 Điểm)

Trong bài thực hành này, tôi đã đóng góp trực tiếp vào các phần việc sau trong mã nguồn:

1. **Thiết kế và Triển khai các công cụ (Tools)**:
   - Viết toàn bộ logic cho 3 công cụ thương mại điện tử trong [custom_tools.py](file:///c:/Users/ADMIN/Desktop/Vin20K-AI-In-Action/Day03_Lab_Chatbot_Vs_React_Agent/src/tools/custom_tools.py) bao gồm: `check_stock` (tra cứu tồn kho, giá bán), `get_discount` (áp mã giảm giá), và `calc_shipping` (tính toán chi phí ship dựa trên trọng lượng tích lũy của đơn hàng).
2. **Nâng cấp bộ parse tham số thông minh trong Agent v2**:
   - Viết mã nguồn cho phương thức `_parse_args` trong [agent.py](file:///c:/Users/ADMIN/Desktop/Vin20K-AI-In-Action/Day03_Lab_Chatbot_Vs_React_Agent/src/agent/agent.py) để tự động bóc tách các tham số mà LLM trả về, hỗ trợ cả 3 dạng: JSON, kwargs (khóa=giá trị) và positional args (tách bằng dấu phẩy).
3. **Tích hợp Telemetry & Phát triển Script Đánh giá**:
   - Viết file [evaluate_run.py](file:///c:/Users/ADMIN/Desktop/Vin20K-AI-In-Action/Day03_Lab_Chatbot_Vs_React_Agent/evaluate_run.py) nhằm tự động hóa việc chạy và so sánh hiệu năng, chi phí giữa Chatbot Baseline và Agent v2, phục vụ cho việc thu thập số liệu telemetry.

---

## II. Phân tích Ca lỗi Debug (Debugging Case Study - 10 Điểm)

- **Mô tả lỗi**: Khi chạy thử nghiệm Agent v1, hệ thống ném lỗi khi thực thi tool `calc_shipping`:
  `Error executing calc_shipping: missing 1 required positional argument: 'destination'`
- **Nguồn Log lỗi**: Ghi nhận trong log tự động:
  ```json
  {"timestamp": "2026-07-10T23:05:16.411372", "event": "TOOL_CALL", "data": {"tool": "calc_shipping", "args": "weight_kg=0.4, destination=\"Hà Nội\""}}
  ```
- **Chẩn đoán**: LLM sinh ra Action dạng gọi hàm positional arguments hoặc một chuỗi đối số thô. Bộ parser cũ của Agent v1 sử dụng Regex chỉ tìm kiếm định dạng `key=value` nên không thể bóc tách giá trị chính xác khi LLM thay đổi cách viết đối số, dẫn đến việc gọi hàm Python bị thiếu tham số.
- **Giải pháp xử lý**: Triển khai giải thuật parse nâng cao trong `_parse_args` ở Agent v2. Nếu Regex `key=value` trả về rỗng, parser sẽ kích hoạt bộ Regex thứ hai để nhận diện các tham số phân tách bằng dấu phẩy, chuyển đổi kiểu dữ liệu tương ứng (int, float, bool, str) và unpack chúng dưới dạng danh sách `*args` khi gọi hàm. Kết quả là Agent v2 xử lý trơn tru mọi định dạng tham số từ LLM.

---

## III. Nhận thức Cá nhân: Chatbot vs ReAct (10 Điểm)

1. **Về khả năng suy luận (Reasoning)**:
   Khối suy nghĩ `Thought` đóng vai trò là một "bảng nháp tư duy" (Scratchpad) của LLM. Thay vì cố gắng đưa ra đáp án ngay lập tức (dẫn đến ảo tưởng hoặc từ chối do thiếu thông tin), khối `Thought` cho phép mô hình lập kế hoạch: *"Tôi cần thông tin gì trước? Tôi phải gọi công cụ nào?"*. Điều này giúp chia nhỏ một bài toán phức tạp thành các chuỗi hành động tuần tự và chính xác.
2. **Độ tin cậy (Reliability)**:
   Agent sẽ hoạt động **kém hiệu quả hơn** Chatbot ở các tác vụ trò chuyện thông thường hoặc Q&A kiến thức phổ thông. Lý do là việc chạy vòng lặp ReAct tốn nhiều token tích lũy và đẩy độ trễ (latency) lên rất cao (4 lượt gọi LLM mất ~10s), trong khi Chatbot thông thường có thể trả lời trực tiếp ngay lập tức chỉ trong 1 lượt gọi LLM (~2s).
3. **Vai trò của phản hồi môi trường (Observation)**:
   Các kết quả `Observation` là dữ liệu thực tế từ môi trường ngoài cung cấp cho LLM. Nó đóng vai trò "mỏ neo thực tế", giúp LLM định hình lại suy nghĩ của mình ở bước tiếp theo, loại bỏ hoàn toàn khả năng bịa đặt dữ liệu (ví dụ: tự bịa giá iPhone hay phí ship).

---

## IV. Đề xuất Cải tiến trong Tương lai (5 Điểm)

1. **Hiệu năng & Độ trễ (Performance & Latency)**:
   Triển khai cơ chế **gọi công cụ song song (Parallel Tool Calling)**. Thay vì gọi `get_discount` ở lượt 2 và `calc_shipping` ở lượt 3, Agent có thể gọi cả hai công cụ này cùng lúc trong một lượt nếu chúng không phụ thuộc lẫn nhau, giúp giảm tổng thời gian phản hồi (latency) của Agent xuống 30-40%.
2. **Bảo mật (Safety)**:
   Áp dụng mô hình **Supervisor Guardrails** (LLM Giám sát). Một LLM thứ hai sẽ chịu trách nhiệm kiểm duyệt đầu ra của Agent hoặc lọc tham số của Tool Call trước khi gửi tới môi trường ngoài, nhằm ngăn chặn các lỗ hổng bảo mật tấn công Prompt Injection.
3. **Khả năng mở rộng (Scalability)**:
   Khi hệ thống phát triển lên hàng trăm công cụ khác nhau, chúng ta không thể đưa toàn bộ mô tả công cụ vào Prompt hệ thống vì sẽ làm tràn cửa sổ ngữ cảnh (context window) và tăng chi phí. Giải pháp là sử dụng **Vector Database** làm Tool Registry để thực hiện truy xuất công cụ liên quan (Tool Retrieval) một cách động dựa trên câu hỏi của người dùng.
