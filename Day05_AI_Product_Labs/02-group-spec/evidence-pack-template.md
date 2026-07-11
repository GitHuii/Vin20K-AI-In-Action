# Template — Evidence Pack

Nộp kèm thin SPEC cuối Day 05.

## 1. Nhóm và track

**Tên nhóm:** MoniPlus Team  
**Track:** Fintech (Tài chính công nghệ)  
**Product/app đã chọn:** MoMo — Moni  
**Build slice đang nghĩ:** Hệ thống phân loại giao dịch chuyển khoản P2P dựa trên NLP (phân tích lời nhắn) và cơ chế phản hồi cá nhân hóa (Personalized Feedback Loop) khi AI phân loại sai hoặc thiếu tự tin.  

## 2. Self-use evidence

Nhóm tự dùng app/workflow và ghi lại điểm gãy.

| Observation | Screenshot/link | Path liên quan | Điều học được |
|---|---|---|---|
| Chuyển khoản P2P ghi "tiền lẩu" nhưng app tự xếp vào danh mục "Chuyển tiền" mặc định. | (Tự thực hiện trên app MoMo) | Failure / Low-confidence | AI của Moni bỏ qua ngữ cảnh lời nhắn, ưu tiên gán nhãn theo loại giao dịch của hệ thống. |
| Sau khi sửa giao dịch từ "Chuyển tiền" sang "Ăn uống", giao dịch tiếp theo cho cùng người đó vẫn bị xếp vào "Chuyển tiền". | (Tự thực hiện trên app MoMo) | Correction | Cơ chế sửa lỗi (Correction Path) hiện tại không lưu lại quy luật học máy để cá nhân hóa cho các giao dịch sau. |

## 3. User / review / social evidence

Nguồn có thể là review App Store/Play, group, comment, phỏng vấn nhanh, hoặc nguồn public khác.

| Quote / review / observation | Nguồn | User là ai? | Pain/failure mode |
|---|---|---|---|
| "Dùng Moni một thời gian thấy biểu đồ chi tiêu lệch hết cả. Chuyển khoản trả tiền cơm cho đồng nghiệp toàn bị tính là chuyển tiền thông thường, cuối tháng ngồi sửa từng cái mệt phát khóc." | Group cộng đồng người dùng MoMo | Nhân viên văn phòng, học sinh sinh viên | Số liệu thống kê chi tiêu bị sai lệch trầm trọng, tính năng tự động hóa chi tiêu mất đi giá trị nếu người dùng vẫn phải nhập/sửa thủ công quá nhiều. |

## 4. Competitor / analog evidence

| App / mô hình tham khảo | Họ xử lý task này thế nào? | Pattern học được | Có áp dụng trong 1 ngày không? |
|---|---|---|---|
| Timo Digital Bank / Splitwise | Timo cho phép tạo tag chi tiêu nhanh (như #anuong, #muasam) hoặc khi sửa danh mục của người nhận A sẽ hỏi: "Bạn có muốn tự động gán nhãn này cho các giao dịch sau với người này không?" | Hỏi người dùng ở thời điểm thích hợp (Low-confidence) và lưu quy luật cá nhân hóa. | Có, hoàn toàn làm được bằng cách lưu cấu trúc Rules đơn giản trong LocalStorage/Database nhỏ của prototype. |

## 5. Evidence -> Insight

```text
Evidence nổi bật nhất:
Giao dịch chuyển khoản P2P ăn chung (chia tiền) bị AI gán nhãn sai thành "Chuyển tiền", và AI không tự động học lại từ hành vi sửa nhãn của người dùng.

Insight:
User không chỉ gặp lỗi hiển thị số liệu.
Thật ra họ cần số liệu chi tiêu chính xác một cách rảnh tay (trust & automation), đồng thời cần hệ thống tự thông minh lên theo thời gian dựa trên các chỉnh sửa của họ (personalized correction learning).

Opportunity:
AI có thể giúp bằng cách đọc hiểu ngữ cảnh tin nhắn chuyển khoản và ghi nhớ thói quen sửa đổi của người dùng để cá nhân hóa bộ phân loại.
```

## 6. Evidence đổi SPEC như thế nào?

- [ ] Đổi user chính.
- [ ] Đổi pain statement.
- [x] Đổi build slice.
- [x] Đổi Auto/Aug decision.
- [x] Đổi 4 paths.
- [ ] Đổi failure mode.
- [ ] Đổi owner/test plan.

Ghi rõ 1-2 thay đổi quan trọng:

```text
Trước evidence, nhóm định xây dựng toàn bộ chatbot tài chính tổng quát.
Sau evidence, nhóm đổi thành tập trung giải quyết lát cắt hẹp: phân loại chính xác lời nhắn chuyển khoản P2P và xây dựng cơ chế tự học từ phản hồi của người dùng (Feedback Loop).
Lý do: Đây là điểm gãy gây khó chịu nhất của các ứng dụng PFM hiện tại và là nơi AI mang lại giá trị thiết thực nhất.
```
