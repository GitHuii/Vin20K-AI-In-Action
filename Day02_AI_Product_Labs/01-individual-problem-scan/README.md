# 01 — Individual Problem Scan (Bài làm cá nhân)

*Học viên: [Điền Họ và Tên]*  
*Mã học viên: [Điền Mã Học Viên]*

---

## 1. Scan rộng (Sắp xếp theo Lăng kính)

| # | Lăng kính | Problem quan sát được | Ai đang gặp khó khăn? (Actor) | Dấu hiệu thực tế / Metric hiện tại |
|---|---|---|---|---|
| 1 | **Lặp lại** | Dọn dẹp môi trường ảo `.venv`, tạo file `.gitignore`, xóa thư mục `.git` con và đặt tên thư mục nộp bài hàng ngày theo đúng quy tắc định dạng của khóa học. | Học viên | Mất 15-20 phút cuối mỗi buổi học chỉ để dọn dẹp và chuẩn bị nộp bài, dễ đặt sai tên thư mục. |
| 2 | **Lặp lại** | Cắt video tập luyện pull-up/push-up (ví dụ từ file `test_pullup.mp4` trong `AI-Calisthenics-Coach`) thành các phân đoạn ngắn chỉ chứa đúng chu kỳ thực hiện động tác để làm dữ liệu đầu vào kiểm thử mô hình Pose Estimation. | Học viên / Developer | Mất 5-10 phút cho mỗi video để cắt thủ công bằng phần mềm edit video. |
| 3 | **Tốn thời gian** | Gán nhãn thủ công (labeling) cho hàng trăm/hàng ngàn ảnh Captcha thô (ví dụ: gõ chữ hiển thị trong ảnh Captcha UNETI) để làm tập dữ liệu train cho mô hình OCR trong dự án `Captcha-Research`. | Học viên / AI Researcher | Mất nhiều giờ gõ nhãn thủ công bằng tay, dễ bị mỏi mắt và sai sót (human error). |
| 4 | **Tốn thời gian** | Thiết bị máy tính cá nhân (local) cấu hình yếu, không đủ khỏe để huấn luyện (train) các mô hình AI trong thời gian dài (gây nóng máy, đơ lag hệ thống, hoặc crash giữa chừng do thiếu VRAM/RAM). | Học viên / AI Developer | Thời gian train lâu (3-5 tiếng cho model nhỏ), máy nóng trên 85°C không làm được việc khác, hoặc crash làm mất công sức train lại từ đầu. |
| 5 | **Tốn thời gian** | Tìm kiếm, tổng hợp và định dạng danh mục tài liệu tham khảo (References) theo chuẩn APA hoặc IEEE khi viết tài liệu `Báo cáo Đồ án.docx`. | Học viên / Sinh viên | Mất cả buổi chỉ để tra cứu thông tin tác giả, năm xuất bản và gõ lại đúng định dạng chuẩn học thuật. |
| 6 | **AI tốt hơn** | Sửa lỗi code Python/AI (lỗi CUDA/GPU, mismatch phiên bản thư viện PyTorch/TensorFlow) khi chạy bài thực hành. | Học viên / Lập trình viên | Phải copy-paste lỗi qua lại giữa terminal và ChatGPT 4-5 lần mới tìm ra cách sửa phù hợp với môi trường local. |
| 7 | **Pain từ người khác** | Tin nhắn trên Discord/Slack của lớp học trôi rất nhanh, dẫn đến việc bỏ lỡ hoặc mất thời gian tìm lại các link tài liệu, deadline, thông báo từ ban tổ chức. | Học viên | Mất 10-15 phút lục lọi tin nhắn cũ trên các kênh chat mỗi khi cần tìm thông tin. |

---

## 2. Lựa chọn Top 3 vấn đề tiềm năng

| Rank | Problem | Vì sao chọn? (Độ đau, tần suất, mức độ sẵn sàng...) | Điều còn chưa chắc chắn / Nghi ngờ? |
|---|---|---|---|
| 1 | **Lặp lại — Dọn dẹp môi trường và chuẩn hóa thư mục nộp bài Lab** | Diễn ra hàng ngày sau mỗi bài lab, dễ bị trừ điểm oan nếu làm sai quy chuẩn đặt tên và cấu trúc thư mục. | Vấn đề này có cần đến AI không, hay chỉ cần một rule-based script/automation là đủ? |
| 2 | **Tốn thời gian — Gán nhãn (labeling) Captcha** | Công việc gán nhãn Captcha thô cực kỳ tẻ nhạt, lặp đi lặp lại và tốn thời gian nhất trong dự án nghiên cứu. Nếu có AI gán nhãn trước (pre-label), tốc độ xây dựng dataset sẽ tăng gấp 10 lần. | Độ chính xác của AI khi gán nhãn ban đầu (nhất là với các Captcha phức tạp, có nhiều nhiễu). |
| 3 | **Tốn thời gian — Thiết bị local yếu không train được model lâu** | Cản trở trực tiếp việc thử nghiệm mô hình trong đồ án hoặc dự án nghiên cứu Captcha. Train local rất hại phần cứng và làm gián đoạn các công việc khác trên máy tính. | Chi phí và cách thiết lập môi trường cloud (như Google Colab, RunPod, Kaggle) để train tự động từ xa. |

---

## 3. Problem Card cho vấn đề ưu tiên nhất (Top 1)

**Vấn đề (1 câu):**  
Học viên mất 15-20 phút cuối mỗi buổi học chỉ để dọn dẹp các thư mục ảo `.venv`, cache, tạo file `.gitignore`, xóa thư mục `.git` con và đặt tên thư mục nộp bài hàng ngày theo đúng chuẩn quy định của VinGroup, dễ dẫn đến sai sót và bị trừ điểm.

**Đối tượng gặp khó khăn (Actor):**  
Học viên khóa học AI Thực Chiến.

**Thời điểm / Bối cảnh xuất hiện:**  
Cuối mỗi buổi học Lab hoặc khi hoàn thành bài tập cần push lên kho lưu trữ (repository) chính.

**Quy trình hiện tại (Current workflow):**  
1. Hoàn thành viết code và chạy thử nghiệm.
2. Thủ công tìm và xóa thư mục `.git` ẩn nằm trong thư mục của Lab để tránh lỗi nested git.
3. Thủ công di chuyển hoặc xóa thư mục môi trường ảo `.venv` và các file cache như `__pycache__` để giải phóng dung lượng.
4. Thủ công đổi tên thư mục gốc của bài Lab theo định dạng `DayXX_Ten_Bai_Lab` (phải tra cứu chuẩn đặt tên của ban tổ chức).
5. Viết hoặc cập nhật file `.gitignore` ở thư mục gốc của dự án.
6. Chạy các lệnh Git để add, commit và push lên repository cá nhân.

**Điểm nghẽn (Bottleneck):**  
Các bước 2, 3, 4 phải làm thủ công, tốn thời gian kiểm tra từng thư mục con để đảm bảo không bị sót file rác hoặc đặt sai tên gây lỗi cấu trúc nộp bài.

**Tác động (Impact):**  
Mất 15-20 phút mỗi ngày. Nếu đặt sai tên hoặc sót thư mục `.git` con sẽ gây lỗi Nested Git Repository (Gitlink), khiến giảng viên không thấy được code bên trong và học viên bị chấm 0 điểm.

**Metric thành công (Success metric):**  
Giảm tổng thời gian dọn dẹp và đóng gói xuống dưới 1 phút. Tỷ lệ sai sót về cấu trúc và định dạng đặt tên bằng 0%.

**Giải pháp thay thế không dùng AI (Non-AI alternative):**  
Viết một script Python hoặc file Batch/PowerShell (.bat/.ps1) chạy tự động quét thư mục, xóa `.venv`, `__pycache__`, `.git` và đổi tên thư mục dựa trên config định sẵn. Giải pháp này khả thi 100% và cực kỳ đáng tin cậy.

**Giả thuyết AI (AI hypothesis):**  
AI tự động quét workspace hiện tại, nhận diện bài lab tương ứng từ tên thư mục gốc, tự động viết file `.gitignore` phù hợp với các công nghệ sử dụng trong Lab đó, dọn dẹp các file rác và thực hiện đóng gói chuẩn chỉnh mà học viên không cần cấu hình thủ công.

**Trực giác ban đầu (Quick gut):**  
Rule (Script tự động hóa) kết hợp Workflow.

### Phác thảo Workflow trước/sau (Top 1)

#### Quy trình hiện tại (Current State) — 15 phút
```text
[1 Chạy code xong] 
→ [2 Tìm và xóa .git con thủ công: 3'] 
→ [3 Xóa .venv & pycache thủ công: 5'] 
→ [4 Tra cứu tên và đổi tên thư mục thủ công: 4'] 
→ [5 Tạo/sửa .gitignore thủ công: 3']
```

#### Quy trình đề xuất có AI (Future State) — 1 phút
```text
[1 Chạy code xong] 
→ [2 Kích hoạt script tự động dọn dẹp & đổi tên: 10 giây] 
→ [3 AI tự quét công nghệ đang dùng, tạo .gitignore chuẩn: 20 giây] 
→ [4 Học viên kiểm tra lại cấu trúc (Human Boundary): 30 giây] 
→ [5 Sẵn sàng commit & push]

*Fallback (Nếu hệ thống/AI lỗi):* Trở lại dọn dẹp thủ công theo các bước của quy trình hiện tại.
```

---

## 4. Tóm tắt nhanh Problem Card #2 và #3

| Card | Actor | Bottleneck | Metric kỳ vọng | Trực giác chọn gì? (Rule/Workflow/Agent) | Vì sao chưa chọn làm Top 1? |
|---|---|---|---|---|---|
| **Top 2: Gán nhãn Captcha** | AI Researcher / Học viên | Gõ nhãn chữ cho từng ảnh Captcha bị méo mó, có nhiễu lớn. | Thời gian gán nhãn 100 ảnh giảm từ 30 phút xuống dưới 3 phút. | **Workflow** (Dùng model OCR có sẵn hoặc API LLM để gán nhãn nháp -> Người dùng xác nhận và sửa lỗi). | Mức độ phức tạp cao hơn, cần thời gian tích hợp model gán nhãn nháp hơn vấn đề nộp bài. |
| **Top 3: Train model local yếu** | Học viên | Chạy huấn luyện mô hình tốn tài nguyên máy tính cá nhân trong thời gian dài, gây quá tải phần cứng. | Chuyển toàn bộ quá trình train lên Cloud tự động chỉ với 1 click, giải phóng 100% tài nguyên local. | **Workflow** (Script tự đóng gói code, upload lên cloud platform như Colab/RunPod, kích hoạt train, và gửi thông báo khi hoàn thành). | Đòi hỏi chi phí thuê cloud hoặc thiết lập API kết nối phức tạp hơn. |
