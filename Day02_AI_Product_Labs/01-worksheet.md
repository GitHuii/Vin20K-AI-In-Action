# Day 02 Lab — Worksheet

> File này là hướng dẫn chính cho toàn bộ lab 4 tiếng. Bộ gợi ý, hướng dẫn công cụ, prompt mẫu và checklist tự kiểm đã được đặt trực tiếp vào từng phase để bạn không phải nhảy qua nhiều file.

## Nguyên tắc

1. **Problem first, not AI first.** Đừng bắt đầu bằng chatbot/agent. Bắt đầu bằng actor, workflow, bottleneck, metric.
2. **Cá nhân scan rộng, nhóm hội tụ.** Mỗi người chuẩn bị nhiều candidate problems; nhóm chọn một candidate đáng đào sâu.
3. **Vẽ workflow trước khi chọn AI.** Nếu chưa thấy bước nào nghẽn, chưa được chọn Rule / Workflow / Agent.
4. **Không cần AI vẫn là kết luận tốt.** Điểm nằm ở chất lượng lập luận, không nằm ở độ "ngầu" của solution.
5. **AI hỗ trợ, không thay quyết định.** Dùng AI để hỏi ngược, phản biện, vẽ lại, research. Người học tự kiểm và tự chốt.
6. **Tự làm trước, AI sau.** Những phần thể hiện suy nghĩ cá nhân như pitch, challenge và reflection không được để AI viết thay.

## Repo nộp bài

Mỗi học viên nộp một repo cá nhân:

```text
Day02-MãHọcViên-HọVàTên/
├── README.md
├── 01-individual-problem-scan/
├── 02-group-problem-statement/
└── 03-individual-reflection/
```

File phụ như ảnh workflow, Mermaid, survey screenshot, research notes đặt cùng prefix:

```text
01-individual-problem-scan-workflow-card-1.png
02-group-problem-statement-workflow.pdf
02-group-problem-statement-research-notes.md
```

Lưu ý: `02-group-problem-statement/` là **bản nộp nhóm**. Nhóm 3-4 người làm chung một bản cuối, sau đó mỗi học viên copy bản này vào repo cá nhân của mình.

## Output cuối cùng

| Phần | Ai làm | Cần có gì |
|---|---|---|
| `01-individual-problem-scan/` | Cá nhân | 5+ problems, top 3 Problem Cards, draft workflow trước/sau cho top 3 |
| `02-group-problem-statement/` | Nhóm | Nhật ký hội tụ, kiểm chứng nhanh, research giải pháp, workflow trước/sau, Problem Statement v0/v1, Rule / Workflow / Agent, quyết định cuối |
| `03-individual-reflection/` | Cá nhân | Vai trò trong nhóm, cách dùng AI, học được gì, nếu làm lại sẽ đổi gì |

## Tiêu chí đánh giá nhanh

Chi tiết rubric nằm trong `README.md`. Bảng dưới đây giúp bạn biết phần nào đang ảnh hưởng tới điểm khi làm worksheet.

| Nhóm / cá nhân | Thành phần | Điểm |
|---|---|---:|
| Nhóm | Workflow trước/sau | 15 |
| Nhóm | Problem Statement + metric + boundary | 20 |
| Nhóm | Độ phù hợp với AI + phương án thay thế | 15 |
| Nhóm | Chất lượng quyết định Go / Not Yet / No-Go | 10 |
| Cá nhân | Scan problem + top 3 Problem Cards | 12 |
| Cá nhân | Tham gia pitch + challenge | 12 |
| Cá nhân | Reflection cá nhân | 10 |
| Cá nhân | Kiểm tra hiểu bài cá nhân | 6 |

Bonus tối đa +10 điểm:

- +3 nếu scan rộng hơn yêu cầu và vẫn cụ thể.
- +3 nếu tương tác tích cực trên Discord hoặc trong nhóm.
- +4 nếu kiểm chứng/research vượt yêu cầu và giúp nhóm sửa lại problem, metric hoặc quyết định cuối.

## Quy ước dùng AI trong lab

| Phần | Có thể dùng AI không? | Cách dùng đúng |
|---|---|---|
| Scan cá nhân | Có, sau khi tự scan trước | Hỏi thêm góc nhìn, rồi tự chọn ý nào là pain thật. |
| Problem Card | Có | Dùng AI để phản biện, không để AI tự bịa problem thay mình. |
| Pitch + challenge | Không dùng để nói/thay mình | Trình bày và phản biện bằng hiểu biết của bản thân. |
| Research | Có | Dùng AI/search để tìm nguồn, nhưng phải kiểm link và ghi rõ giả định chưa chắc. |
| Workflow | Có | Có thể dùng AI/Mermaid để vẽ lại flow, nhưng phải tự kiểm từng bước. |
| Reflection | Không dùng để viết thay | Có thể dùng AI để gợi ý câu hỏi tự soi, nhưng câu trả lời phải là trải nghiệm thật của mình. |

## Gợi ý công cụ nhanh

| Phase | Tool có thể dùng | Dùng để làm gì | Lưu ý |
|---|---|---|---|
| Phase 1 | ChatGPT / Claude / Gemini, Google, review app/forum | Gợi ý thêm problem nếu bí | Tự scan trước; bỏ ý không có trải nghiệm thật. |
| Phase 2 | ChatGPT / Claude | Phản biện Problem Card | Prompt rõ: "chỉ ra điểm yếu, đừng khen". |
| Phase 4 | Google, Perplexity, tài liệu chính thức, survey/interview nhanh | Kiểm chứng pain, tìm giải pháp đã có | Không dùng số liệu nếu không kiểm được nguồn. |
| Phase 5 | Giấy/bảng, Mermaid, Excalidraw, FigJam | Vẽ workflow trước/sau | Vẽ tay cho rõ tư duy trước, số hóa sau nếu cần nộp đẹp hơn. |
| Phase 6 | ChatGPT / Claude | Hỏi phản biện Rule / Workflow / Agent | Không để AI chốt thay. Nhóm phải tự quyết định. |
| Phase 7 | Không bắt buộc | Chỉ dùng để gợi ý câu hỏi tự soi | Không copy reflection do AI viết. |

---

# Phase 0 — Worked Example (15')

Mở `02-deliverable-example.md` để xem một bài hoàn chỉnh. Khi đọc, chú ý:

- cá nhân scan rộng như thế nào,
- top 3 Problem Cards cụ thể ra sao,
- nhóm hội tụ từ nhiều candidates về một bài như thế nào,
- research giải pháp giúp nhóm tránh nghĩ trong chân không ra sao,
- workflow trước/sau thể hiện bottleneck, boundary và phương án quay về nếu AI sai như thế nào,
- Problem Statement v0/v1 khác nhau ở đâu.

Self-check:

- [ ] Tôi hiểu nhóm chỉ chọn **candidate problem**, không chọn ngay Problem Statement.
- [ ] Tôi hiểu deep-dive gồm validation, research, workflow, metric, PS và AI decision.

---

# Phase 1 — Individual Scan: tìm 5+ problems (25')

## Mục tiêu

Mỗi người scan rộng nhất 5 problems từ trải nghiệm thật. Đây là phần phân kỳ cá nhân.

Bonus:

- 8+ problems: bonus nếu vẫn cụ thể.
- 10+ problems: bonus tốt nếu đa dạng lăng kính và có dấu hiệu thật.
- Không bonus cho list dài nhưng toàn ý chung chung.

## 4 lăng kính để scan

Một problem có thể rơi vào nhiều lăng kính. Không cần phân loại hoàn hảo ở bước này. Dùng lăng kính để mở rộng quan sát, rồi bước sau mới filter.

| Lăng kính | Câu hỏi gợi mở | Ví dụ |
|---|---|---|
| **Lặp lại** | Việc gì cứ xuất hiện đều đặn mỗi ngày/tuần/tháng?<br>Nếu phải làm thêm 10 lần nữa, phần nào tôi muốn chuẩn hóa hoặc tự động hóa?<br>Người mới vào có phải hỏi lại cùng một quy trình không? | Báo cáo tuần, nhập liệu, tổng hợp câu hỏi |
| **Tốn thời gian** | Việc gì mỗi lần làm đều nặng, dù không nhất thiết xảy ra thường xuyên?<br>Thời gian mất ở đâu: tìm thông tin, đọc hiểu, tổng hợp, chờ người khác, format, hay sửa lại?<br>Nếu giảm 50% thời gian thì có đáng kể không? | Đọc tài liệu dài, tìm quyết định cũ, review PRD |
| **AI có thể tốt hơn** | Việc gì cần hiểu ngữ cảnh, đọc/viết ngôn ngữ, phân loại, so sánh, tổng hợp hoặc gợi ý đúng lúc?<br>Nếu AI chỉ hỗ trợ một bước trong workflow, bước nào đáng hỗ trợ nhất?<br>Nếu AI sai ở bước đó thì hậu quả là gì? | Search tài liệu, gợi ý next step, tóm tắt nhiều nguồn |
| **Pain từ người khác** | Ai ngoài tôi đang bị kẹt hoặc phàn nòm lặp lại?<br>Họ thường nói câu gì, hỏi lại điều gì, hoặc bỏ sót bước nào?<br>Có dấu hiệu thật không: ticket, Slack/Discord, comment, survey, phản hồi trực tiếp? | Hỏi lại deadline, không hiểu task, support ticket lặp lại |

Cách phân biệt nhanh:

- `Lặp lại` bắt đầu từ câu hỏi: việc này xảy ra bao nhiêu lần?
- `Tốn thời gian` bắt đầu từ câu hỏi: mỗi lần làm tốn bao nhiêu công?
- Một problem vừa lặp lại vừa tốn thời gian thì càng đáng đưa vào danh sách scan.

Nếu bí, tự hỏi:

- Tuần trước tôi mất nhiều thời gian nhất vào việc gì?
- Việc gì tôi hay trì hoãn vì nhàm chán hoặc rối?
- Người khác hay hỏi tôi câu gì lặp lại?
- Có workflow nào ở trường/công ty ai cũng biết là chậm?
- Có app nào tôi dùng và thường nghĩ "giá như nó hiểu mình hơn"?

Một số điểm bắt đầu dễ quan sát:

| Bối cảnh | Có thể nhìn vào đâu? | Câu hỏi gợi mở |
|---|---|---|
| Học tập | Bài tập, tài liệu, deadline, câu hỏi lặp lại trong lớp | Phần nào làm tôi mất thời gian vì phải đọc, tổng hợp, hỏi lại hoặc đoán ý? |
| Công việc / thực tập | Báo cáo, họp hành, giao tiếp, tra cứu quy trình | Bước nào trong quy trình làm việc của tôi (hoặc phòng ban) đang là nút thắt cổ chai? |
| Đời sống hàng ngày | Lên lịch, quản lý tài chính, tìm kiếm thông tin, mua sắm | Việc gì tôi phải làm đi làm lại và cảm thấy có thể tối ưu hóa được? |
