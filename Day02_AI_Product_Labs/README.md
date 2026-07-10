# Day 02 Lab — Tìm Đúng Bài Toán Cho AI

> Từ vấn đề thật quanh mình → workflow rõ → Problem Statement đủ chặt → chọn Rule / Workflow / Agent → quyết định Go / Not Yet / No-Go.

## Tài liệu trong folder này

Folder này chỉ giữ các file cần thiết:

| File | Dùng để làm gì |
|---|---|
| `01-worksheet.md` | File hướng dẫn chính cho toàn bộ lab 4 tiếng. Bộ gợi ý, hướng dẫn công cụ, prompt và checklist tự kiểm đã được tích hợp trực tiếp vào từng phase. |
| `02-deliverable-example.md` | Ví dụ bài nộp hoàn chỉnh để học viên nhìn được output cuối cùng trông như thế nào. |

## Cấu trúc repo nộp bài

Mỗi học viên nộp **một repo cá nhân**:

```text
Day02-MãHọcViên-HọVàTên/
├── README.md
├── 01-individual-problem-scan/
├── 02-group-problem-statement/
└── 03-individual-reflection/
```

Trong đó:

- `01-individual-problem-scan/`: bài cá nhân, gồm scan 5+ problems, top 3 Problem Cards, draft workflow trước/sau.
- `02-group-problem-statement/`: **bản nộp nhóm**. Nhóm 3-4 người làm chung một bản gồm nhật ký hội tụ, kiểm chứng/research, Problem Statement, Rule / Workflow / Agent, quyết định cuối, workflow trước/sau. Mỗi học viên copy bản cuối vào repo cá nhân của mình.
- `03-individual-reflection/`: reflection cá nhân về AI, vai trò trong nhóm, và bài học sau lab.

Nếu có file phụ như ảnh workflow, Mermaid, survey screenshot, research notes, đặt cùng prefix với phần liên quan:

```text
01-individual-problem-scan-workflow-card-1.png
02-group-problem-statement-workflow.pdf
02-group-problem-statement-research-notes.md
```

## Đọc file nào để làm gì?

1. Mở `02-deliverable-example.md` trước để nhìn một bản nộp tốt trông như thế nào.
2. Làm theo `01-worksheet.md` từ Phase 1 đến Phase 7. Worksheet là hướng dẫn suy nghĩ theo từng bước, không chỉ là form để điền.
3. Khi nộp, repo cá nhân cần có đủ 3 phần: problem scan cá nhân, bản nộp nhóm, reflection cá nhân.

## Tiêu chí đánh giá (100 điểm)

Điểm của mỗi học viên gồm **điểm nhóm 60 điểm** và **điểm cá nhân 40 điểm**. Điểm nhóm là điểm cho bản nộp nhóm; mỗi học viên vẫn copy bản cuối vào repo cá nhân của mình. Bài làm không cần chọn Agent mới được điểm cao. Điểm nằm ở việc nhóm hiểu đúng bài toán, lập luận rõ, biết vì sao nên hoặc không nên dùng AI.

Ngoài 100 điểm chính, học viên có thể có **tối đa +10 điểm bonus**.

### A. Điểm nhóm — 60 điểm

| Thành phần | Điểm | Cần thể hiện rõ |
|---|---:|---|
| Workflow trước/sau | 15 | Vẽ được workflow hiện tại và workflow sau tối ưu. Nhìn ra bước nghẽn, ai làm bước đó, mất bao lâu, bàn giao qua ai, AI hoặc tự động hóa nằm ở đâu, fallback như thế nào nếu AI làm sai. |
| Problem Statement | 20 | Viết được Problem Statement đủ chặt chẽ (gồm Actor, Pain, Current State, Metric, Boundary). Có sự tiến hóa từ bản phác thảo ban đầu (v0) sang bản hoàn chỉnh (v1) sau khi đã làm nghiên cứu và vẽ workflow. |
| Độ phù hợp với AI | 15 | Lập luận thuyết phục vì sao bài toán này phù hợp với AI, so sánh với phương án thay thế không dùng AI. Chọn cấu hình phù hợp (Rule, Workflow, hay Agent) và giải thích vì sao. |
| Quyết định cuối cùng | 10 | Đưa ra quyết định Go, Not Yet, hoặc No-Go rõ ràng, kèm điều kiện kích hoạt hành động tiếp theo. |

### B. Điểm cá nhân — 40 điểm

| Thành phần | Điểm | Cần thể hiện rõ |
|---|---|---|
| Phân kỳ cá nhân (Scan) | 12 | Có danh sách scan ít nhất 5 problems từ lăng kính đa dạng (lặp lại, tốn thời gian, AI tốt hơn, pain từ người khác). Có 3 Problem Cards chi tiết, mỗi card gồm actor, bottleneck và metric rõ ràng. |
| Pitch & Challenge | 12 | Nhật ký nhóm ghi nhận cá nhân đã giới thiệu (pitch) ý tưởng của mình rõ ràng, và đặt câu hỏi phản biện (challenge) mang tính xây dựng cho ý tưởng của các thành viên khác. |
| Reflection cá nhân | 10 | Tự đánh giá trung thực về trải nghiệm làm việc nhóm, cách sử dụng AI trong quá trình làm bài, bài học lớn nhất rút ra, và điểm sẽ thay đổi nếu được làm lại từ đầu. |
| Kiểm tra hiểu bài | 6 | Trả lời đúng các câu hỏi trắc nghiệm/ngắn ở cuối worksheet để xác nhận hiểu các khái niệm cốt lõi (problem statement, boundary, metric, fallback). |
