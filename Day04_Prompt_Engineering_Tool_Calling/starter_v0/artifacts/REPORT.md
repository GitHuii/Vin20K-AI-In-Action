# Day 04 Lab v2 Report — Research Agent

## Team

- Team: Self-Study Team (Tự học tại nhà)
- Members: 1 member
- Provider/model: Google Gemini / `gemini-3.1-flash-lite`

---

# PHẦN A — Giới thiệu agent

## A1. Agent này làm được gì

Research Agent là một trợ lý ảo thông minh giúp thu thập, tra cứu tin tức thời sự trên web, tổng hợp bài đăng trên mạng xã hội Twitter, tìm kiếm các bài báo khoa học ArXiv, đọc hiểu nội dung một bài viết qua URL, tích hợp công cụ máy tính bỏ túi an toàn và có khả năng gửi báo cáo lên Telegram sau khi được người dùng xác nhận Yes/No.

**Link dùng thử (deploy):**

> URL: http://localhost:8501 (Chạy cục bộ bằng Streamlit)

## A2. Tool agent có

| Tên tool | Làm được gì | Tool mới nhóm thêm? |
|---|---|---|
| clarify | Hỏi lại người dùng khi thiếu thông tin (handle Twitter, URL...) hoặc xin xác nhận trước khi gửi | không |
| timeline | Lấy các bài đăng gần đây của một người dùng cụ thể trên Twitter | không |
| social_search | Tìm kiếm các bài đăng trên mạng xã hội theo từ khóa chủ đề | không |
| lookup | Tra cứu thông tin trên Internet qua công cụ tìm kiếm Web | không |
| fetch | Đọc toàn bộ nội dung văn bản từ một đường dẫn URL | không |
| format | Trình bày các item thu thập được thành văn bản Markdown chuyên nghiệp | không |
| send | Gửi văn bản lên kênh Telegram chỉ định (yêu cầu cờ confirmed=true) | không |
| policy | Tra cứu quy định, tài liệu chính sách nội bộ | không |
| papers | Tìm kiếm các bài báo khoa học trên ArXiv | không |
| paper_text | Tải PDF ArXiv và trích xuất nội dung văn bản | không |
| calculator | Tính toán biểu thức toán học dạng chuỗi an toàn bằng thư viện math | **có** |

## A3. Câu hỏi mẫu để thử

1. "Tin tức AI hôm nay có gì nổi bật không?"
2. "Tìm bài báo khoa học về Diffusion models trên ArXiv giúp mình."
3. "Tính biểu thức này giúp mình: 15 * 4 - 3"
4. "Đăng tin nhắn này lên Telegram giúp mình: Báo cáo tiến độ Lab 4 đã hoàn thành."

---

# PHẦN B — Chi tiết / Bằng chứng

## B1. Version Evidence

| Version | Changed Artifact | Hypothesis | Metric Before | Metric After | Run File |
|---|---|---|---:|---:|---|
| v0 | baseline | Chạy baseline mặc định ban đầu | 0.0 | 0.6 | runs/v0_B_base_gemini_20260711T071258248700.json |
| v1 | system_prompt.md | Thiết lập quy tắc mapping, clarify khi thiếu handle/URL và từ chối out_of_scope sẽ cải thiện điểm số | 0.6 | 0.9 | runs/v1_B_base_gemini_20260711T071747146141.json |
| v2 | system_prompt.md | Bắt buộc khai báo tường minh response_type và hỏi yes_no khi send sẽ giải quyết các lỗi còn lại | 0.9 | 1.0 | runs/v2_B_base_gemini_20260711T072237130414.json |
| v3 | tools.yaml & system_prompt.md | Thêm tool calculator và bắt buộc khai báo topic trong lookup sẽ giúp pass 100% cả base và group cases | 1.0 | 1.0 | runs/v3_B_group_gemini_20260711T082612123247.json |

## B2. Failure Analysis

| Case ID | Failure Type | Actual Tool Calls | What Failed | Fix |
|---|---|---|---|---|
| R03_web_news_routing | wrong_tool | lookup(query="AI news today") | Query bị dính từ "news today" do Agent tự thêm vào | Viết quy tắc bắt buộc lọc query sạch, chỉ giữ từ khóa chính |
| R10_missing_handle | missing_info | timeline(screenname="sama") | Agent tự đoán handle "sama" khi người dùng chỉ nói "tóm tắt 5 tweet mới nhất" | Quy định bắt buộc gọi clarify hỏi handle khi thiếu |
| R12_confirm_before_send | wrong_boundary | send(text="...") | Agent gửi thẳng tin nhắn Telegram mà không xin xác nhận | Yêu cầu gọi clarify(response_type="yes_no") trước khi gọi send |

## B3. Team Eval Cases

| Case ID | What It Tests | Expected Tool/Behavior | Result |
|---|---|---|---|
| G01_calculator_test | Tính toán biểu thức số học cơ bản | calculator(expression="(12 + 15) * 3") | PASS |
| G02_arxiv_search | Tìm kiếm bài báo khoa học | papers(query="Transformer model") | PASS |
| G03_missing_handle_clarify | Hỏi lại khi thiếu handle | clarify(response_type="text") | PASS |
| G04_out_of_scope_creative | Từ chối yêu cầu sáng tác văn học | no_tool (trả lời từ chối bằng văn bản) | PASS |
| G05_web_news_vietnamese | Trích xuất query tiếng Việt và timeframe | lookup(query="trí tuệ nhân tạo", topic="news", timeframe="week") | PASS |
| G06_multiturn_clarify_calculator | Nhận diện biểu thức sau lượt clarify | calculator(expression="15 * 4 - 3") | PASS |
| G07_multiturn_change_calculator | Thay đổi biểu thức tính toán ở lượt sau | calculator(expression="2 * 3") | PASS |
| G08_multiturn_carryover_arxiv | Giữ ngữ cảnh arXiv ở lượt tiếp theo | papers(query="Diffusion models") | PASS |
| G09_multiturn_confirm_telegram | Gọi send sau khi user xác nhận yes | send(confirmed=true) | PASS |
| G10_multiturn_switch_tool_arxiv_web | Đổi công cụ từ arXiv sang web và giữ query | lookup(query="GPT-4", topic="general") | PASS |

## B4. Live Chat Evidence

| Turn | User Request | Tool Calls | Version Evidence | Outcome |
|---|---|---|---|---|
| 1 | Tweet mới nhất của Sam Altman là gì? | timeline(screenname="sama") | v3 | Gọi đúng tool timeline với handle mapped chính xác |
| 2 | Đăng bản tin này lên Telegram nhé | clarify(response_type="yes_no") | v3 | Hỏi xác nhận trước khi thực hiện hành động ghi |
| 3 | Đúng thế, gửi đi | send(confirmed=true) | v3 | Thực thi gửi thành công sau khi được xác nhận |

## B5. Bonus Evidence

| Bonus | Evidence File | What Worked | Risk / Guardrail |
|---|---|---|---|
| send (Telegram) | tools/send/tool.py | Gửi tin nhắn Telegram qua Bot API | Đòi hỏi xác nhận yes/no trước khi gọi API để tránh spam |
| arXiv/company policy | tools/papers/tool.py | Tìm kiếm arxiv và đọc hiểu bài báo | Giới hạn dung lượng text tải về để tránh tràn cửa sổ ngữ cảnh |
| custom tool | tools/calculator/tool.py | Tính toán biểu thức toán học an toàn | Không sử dụng eval trực tiếp, lọc kỹ ký tự lạ để tránh RCE |

## B6. Reflection

*   **Which fixes belonged in `system_prompt.md`?**
    *   Các quy tắc về ánh xạ tên người sang handle, từ chối câu hỏi ngoài phạm vi, quy định hỏi lại clarify khi thiếu thông tin, và ranh giới bắt buộc xin xác nhận yes/no trước khi send.
*   **Which fixes belonged in `tools.yaml`?**
    *   Định nghĩa schema của công cụ mới `calculator`, mô tả rõ các tham số và kiểu dữ liệu để Agent gọi chính xác.
*   **Which failure needed manual review instead of automatic grading?**
    *   Nội dung của câu hỏi clarify do Agent tự sinh bằng ngôn ngữ tự nhiên (đảm bảo câu hỏi có tự nhiên, lịch sự và đúng trọng tâm hay không).
*   **What would you improve next?**
    *   Tích hợp cơ chế tự động thử lại (retry) với khoảng thời gian chờ (delay) động hoặc cơ chế hàng đợi (queue) để tối ưu hiệu năng gọi API khi gặp giới hạn Rate Limit của Free Tier mà không làm chậm quá trình kiểm thử.
