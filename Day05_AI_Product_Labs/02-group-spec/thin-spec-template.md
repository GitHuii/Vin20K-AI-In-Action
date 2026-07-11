# Template — Thin SPEC Cuối Day 05

Thin SPEC không phải PRD đầy đủ. Đây là bản cam kết đủ rõ để sáng Day 06 nhóm build ngay.

## 1. Track, product/app và user

**Track:** Fintech  
**Product/app thật:** MoMo — Moni  
**User cụ thể:** Học sinh sinh viên, nhân viên văn phòng hay đi ăn uống, mua sắm chung và thanh toán bằng chuyển khoản MoMo P2P kèm lời nhắn mô tả.  
**Nhóm có phải user thật không? Nếu không, khác ở đâu?** Có, chính tụi mình là những người hàng ngày đi ăn trưa chung và chia tiền qua chuyển khoản, liên tục gặp lỗi phân loại sai của app.  

## 2. Evidence summary

| Evidence | Nguồn | User/pain nói lên điều gì? | SPEC phải đổi gì? |
|---|---|---|---|
| Chuyển khoản ghi "tiền lẩu" bị xếp vào "Chuyển tiền". | Self-use | AI của MoMo ưu tiên phân loại theo loại hình giao dịch của hệ thống hơn là phân tích ngữ cảnh text. | Cần bổ sung module xử lý ngôn ngữ tự nhiên (NLP) để phân tích lời nhắn chuyển khoản. |
| Người dùng phàn nàn phải ngồi sửa tay từng giao dịch vào cuối tháng. | Group MoMo | Sửa tay quá mất thời gian, làm giảm giá trị của việc tự động hóa chi tiêu. | Thêm luồng Low-confidence để hỏi xác nhận ngay khi giao dịch phát sinh thay vì để user tự tìm sửa sau. |
| Sau khi sửa xong, giao dịch sau cho cùng người đó vẫn bị lỗi. | Self-use | Hệ thống thiếu Feedback Loop để học hỏi từ chỉnh sửa của người dùng. | Cần thiết kế Personalized Feedback Loop (lưu rules cá nhân hóa). |

## 3. Pain statement

```text
User nhân viên văn phòng/học sinh sinh viên đang gặp khó ở bước xem báo cáo chi tiêu và thống kê tài chính cuối tháng,
vì AI của Moni phân loại sai các giao dịch chuyển khoản ăn chung/mua hộ vào danh mục mặc định "Chuyển tiền",
dẫn tới thống kê chi tiêu bị sai lệch nghiêm trọng, làm mất thời gian tự sửa tay mà AI vẫn không thông minh hơn.
Bằng chứng chính là phản hồi từ cộng đồng người dùng ví điện tử và trải nghiệm thực tế của nhóm.
```

## 4. Build slice

```text
Cho user chuyển khoản MoMo P2P chia tiền ăn chung/mua hộ,
prototype sẽ dùng AI để đọc hiểu lời nhắn chuyển tiền để tự động phân loại danh mục chi tiêu,
tạo ra giao dịch được gán nhãn chính xác (hoặc card xác nhận nhanh nếu độ tự tin thấp),
và xử lý failure mode (AI phân loại sai) bằng cơ chế Feedback Loop lưu quy luật chỉnh sửa của user để cá nhân hóa cho các giao dịch sau.
```

## 5. Auto/Aug decision

Chọn một:

- [ ] **Augmentation:** AI gợi ý/draft/phân loại, user quyết cuối.
- [x] **Conditional automation:** AI tự làm trong case hẹp; case mơ hồ/rủi ro chuyển người.
- [ ] **Automation:** AI tự quyết và tự hành động.

**Lý do chọn:** Tránh việc AI tự tiện gán nhãn sai làm lệch biểu đồ chi tiêu mà user không biết, nhưng vẫn giảm 90% công sức nhập tay bằng cách tự động hóa các giao dịch rõ ràng.  
**Human role:** Decider (người quyết định khi AI phân vân) và Trainer (người huấn luyện AI qua hành vi sửa nhãn).  

## 6. Four paths

| Path | Prototype phải thể hiện gì? |
|---|---|
| Happy | User nhập "tiền bún chả" -> AI tự tin phân loại thành danh mục **Ăn uống** (hiển thị nhãn xanh). |
| Low-confidence | User nhập "Gửi Nam" -> AI phân vân -> Hệ thống hiện card hỏi: "Giao dịch này cho mục đích gì?" kèm nút bấm gợi ý: [Ăn uống] [Chuyển tiền] [Mua sắm]. |
| Failure | User nhập "mua hộ cuốn sách" -> AI phân loại sai thành **Mua sắm** (thay vì **Học tập**) -> User bấm vào giao dịch và chọn sửa lại thành **Học tập**. |
| Correction | Hệ thống ghi nhớ hành vi sửa đổi. Lần tiếp theo user nhập "sách cho Nam" -> AI tự động phân loại đúng là **Học tập** (Personalized Rule). |

## 7. Failure mode nguy hiểm nhất

```text
Nếu user chuyển tiền ăn chung nhưng AI phân loại sai thành một danh mục nhạy cảm/không liên quan (ví dụ: Đầu tư hoặc Trả nợ),
AI có thể làm sai lệch hoàn toàn báo cáo ngân sách và cảnh báo chi tiêu vượt hạn mức của user,
hậu quả là user đưa ra quyết định tài chính sai lầm hoặc ức chế xóa app.
Prototype sẽ xử lý bằng nút Undo nhanh ở thông báo và cơ chế chỉnh sửa 1-click danh mục ngay tại danh sách giao dịch.
Owner kiểm thử path này là: Học viên (Bạn).
```

## 8. Owner plan cho sáng Day 06

| Thành viên | Việc phụ trách | Bằng chứng cần có trong repo |
|---|---|---|
| Học viên (Bạn) | Research / evidence & Test / failure path | Viết bộ dữ liệu test mẫu (`test_cases.json`) gồm các câu text dễ bị phân loại sai; trực tiếp test giao diện prototype và kịch bản demo. |
| Antigravity (AI) | SPEC & Prototype | Viết code giao diện HTML/CSS/JS giả lập (giao diện ví MoMo đơn giản); xây dựng logic NLP phân loại text bằng Regex + AI rule, lưu cơ chế Feedback Loop vào LocalStorage. |
