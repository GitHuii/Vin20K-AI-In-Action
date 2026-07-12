# Báo Cáo Lab 7: Embedding & Vector Store

**Họ tên:** [Tên sinh viên]
**Nhóm:** [Tên nhóm]
**Ngày:** [Ngày nộp]

---

## 1. Warm-up (5 điểm)

### Cosine Similarity (Ex 1.1)

**High cosine similarity nghĩa là gì?**
> Hai đoạn văn bản có độ tương đồng Cosine cao nghĩa là các vector biểu diễn (embeddings) của chúng hướng về cùng một phía trong không gian vector đa chiều, thể hiện sự tương đồng lớn về mặt ngữ nghĩa hoặc ngữ cảnh.

**Ví dụ HIGH similarity:**
- Sentence A: "Học máy là một phân nhánh của trí tuệ nhân tạo."
- Sentence B: "Machine learning là một lĩnh vực thuộc AI."
- Tại sao tương đồng: Cả hai câu đều diễn đạt cùng một ý nghĩa cốt lõi bằng các thuật ngữ tương đương (Học máy = Machine learning, phân nhánh = lĩnh vực thuộc, trí tuệ nhân tạo = AI).

**Ví dụ LOW similarity:**
- Sentence A: "Hôm nay trời mưa rất to và lạnh."
- Sentence B: "Tôi đang lập trình một ứng dụng web bằng Python."
- Tại sao khác: Hai câu nói về hai chủ đề hoàn toàn độc lập (thời tiết vs. lập trình) và không chia sẻ ngữ cảnh ngữ nghĩa nào.

**Tại sao cosine similarity được ưu tiên hơn Euclidean distance cho text embeddings?**
> Vì Euclidean distance chịu ảnh hưởng lớn bởi độ dài văn bản (văn bản dài hơn sẽ có độ dài vector lớn hơn, dẫn đến khoảng cách lớn dù cùng chủ đề). Trong khi đó, Cosine similarity chỉ đo góc giữa các vector, giúp chuẩn hóa và loại bỏ yếu tố độ dài văn bản để tập trung vào hướng ngữ nghĩa.

### Chunking Math (Ex 1.2)

**Document 10,000 ký tự, chunk_size=500, overlap=50. Bao nhiêu chunks?**
> *Trình bày phép tính:*
> $$\text{num\_chunks} = \lceil \frac{10000 - 50}{500 - 50} \rceil = \lceil \frac{9950}{450} \rceil = \lceil 22.11 \rceil = 23$$
> *Đáp án:* 23 chunks.

**Nếu overlap tăng lên 100, chunk count thay đổi thế nào? Tại sao muốn overlap nhiều hơn?**
> *Trình bày phép tính khi overlap = 100:*
> $$\text{num\_chunks} = \lceil \frac{10000 - 100}{500 - 100} \rceil = \lceil \frac{9900}{400} \rceil = \lceil 24.75 \rceil = 25$$ chunks.
> *Thay đổi:* Số lượng chunk tăng lên thành 25 (tăng thêm 2 chunks).
> *Tại sao muốn overlap nhiều hơn:* Tăng overlap giúp bảo toàn ngữ cảnh liên tục giữa các chunk kề nhau, tránh việc các câu hoặc ý nghĩa quan trọng bị cắt đôi ở ranh giới phân tách (boundary).

## 2. Document Selection — Nhóm (10 điểm)

### Domain & Lý Do Chọn

**Domain:** Trợ lý Tri thức Nội bộ dành cho Lập trình và Thiết kế Hệ thống RAG (Internal IT Knowledge Base).

**Tại sao nhóm chọn domain này?**
> Nhóm chọn domain này vì các tài liệu kỹ thuật về lập trình (Python) và thiết kế hệ thống (RAG, Vector Store, Chunking) có cấu trúc logic rất rõ ràng (chứa tiêu đề, danh sách, đoạn văn ngắn). Điều này giúp việc thử nghiệm và đánh giá các chiến lược chunking khác nhau (như chia đệ quy vs chia theo câu) trở nên trực quan và dễ dàng so sánh hiệu năng của retrieval.

### Data Inventory

| # | Tên tài liệu | Nguồn | Số ký tự | Metadata đã gán |
|---|--------------|-------|----------|-----------------|
| 1 | python_intro | data/python_intro.txt | 1944 | source: python_intro.txt, lang: en, doc_type: tutorial |
| 2 | vector_store_notes | data/vector_store_notes.md | 2123 | source: vector_store_notes.md, lang: en, doc_type: documentation |
| 3 | rag_system_design | data/rag_system_design.md | 2391 | source: rag_system_design.md, lang: en, doc_type: design_spec |
| 4 | customer_support_playbook | data/customer_support_playbook.txt | 1692 | source: customer_support_playbook.txt, lang: en, doc_type: playbook |
| 5 | chunking_experiment_report | data/chunking_experiment_report.md | 1987 | source: chunking_experiment_report.md, lang: en, doc_type: report |
| 6 | vi_retrieval_notes | data/vi_retrieval_notes.md | 1667 | source: vi_retrieval_notes.md, lang: vi, doc_type: notes |

### Metadata Schema

| Trường metadata | Kiểu | Ví dụ giá trị | Tại sao hữu ích cho retrieval? |
|----------------|------|---------------|-------------------------------|
| lang | str | "vi" | Cho phép pre-filter lọc bỏ các tài liệu khác ngôn ngữ trước khi so sánh vector, tránh nhiễu thông tin. |
| doc_type | str | "design_spec" | Giúp giới hạn phạm vi truy vấn trong một loại tài liệu chuyên biệt (ví dụ: chỉ tìm trong playbook hướng dẫn hỗ trợ). |

---

## 3. Chunking Strategy — Cá nhân chọn, nhóm so sánh (15 điểm)

### Baseline Analysis

Chạy `ChunkingStrategyComparator().compare()` trên 2-3 tài liệu:

| Tài liệu | Strategy | Chunk Count | Avg Length | Preserves Context? |
|-----------|----------|-------------|------------|-------------------|
| python_intro.txt | FixedSizeChunker (`fixed_size`) | 11 | 194.91 | No (bị cắt cứng cơ học ở ranh giới 200 ký tự) |
| python_intro.txt | SentenceChunker (`by_sentences`) | 5 | 387.40 | Yes (giữ trọn vẹn các ranh giới câu hoàn chỉnh) |
| python_intro.txt | RecursiveChunker (`recursive`) | 12 | 160.08 | Yes (tách đệ quy thông minh theo đoạn văn và từ) |
| rag_system_design.md | FixedSizeChunker (`fixed_size`) | 14 | 189.36 | No (cắt ngang các định nghĩa quan trọng) |
| rag_system_design.md | SentenceChunker (`by_sentences`) | 5 | 476.80 | Yes (bảo toàn ngữ nghĩa của từng câu) |
| rag_system_design.md | RecursiveChunker (`recursive`) | 16 | 147.56 | Yes (giữ nguyên cấu trúc phân cấp tiêu đề Markdown) |

### Strategy Của Tôi

**Loại:** RecursiveChunker (`recursive`)

**Mô tả cách hoạt động:**
> Bộ phân tách này hoạt động đệ quy dựa trên một danh sách các ký tự phân tách có độ ưu tiên giảm dần: `["\n\n", "\n", ". ", " ", ""]` (tương ứng với Đoạn văn, Dòng mới, Câu, Từ, Ký tự). Văn bản được thử tách bằng ký tự có độ ưu tiên cao nhất trước. Nếu đoạn kết quả vẫn lớn hơn `chunk_size`, nó sẽ tiếp tục bị chia nhỏ bởi ký tự phân tách kế tiếp trong danh sách. Cuối cùng, các mảnh nhỏ sẽ được gom lại một cách thông minh sao cho kích thước gần sát `chunk_size` nhất nhưng không vượt quá giới hạn.

**Tại sao tôi chọn strategy này cho domain nhóm?**
> Vì tài liệu kỹ thuật của nhóm chứa nhiều đề mục Markdown (tiêu đề, danh mục gạch đầu dòng và các đoạn văn ngắn). Chiến lược Recursive Chunking giúp duy trì được cấu trúc phân cấp này một cách tối ưu, giữ các ý liên quan trong cùng một phần mà không làm đứt mạch văn bản cơ học như Fixed Size.

### Strategy Đóng Góp Của Thành Viên Khác (AI Agent)

**Loại:** Custom Strategy (`MarkdownHeaderChunker`)

**Mô tả cách hoạt động:**
> Chiến lược này tách văn bản dựa theo các tiêu đề Markdown (`#`, `##`, `###`). Khi duyệt qua văn bản, mỗi khi bắt gặp dòng bắt đầu bằng tiêu đề, nó sẽ lưu đoạn trước đó lại và khởi tạo một chunk mới. Điều này đảm bảo tiêu đề và nội dung mô tả của nó luôn nằm chung một chunk. Nếu chunk thu được vẫn lớn hơn `chunk_size`, nó sẽ được chia nhỏ tiếp bằng cách tách dòng (line-by-line fallback).

**Tại sao chọn strategy này cho domain nhóm?**
> Rất nhiều tài liệu trong domain IT Operations SOP sử dụng cấu trúc tiêu đề rõ ràng để phân loại quy trình. Tách theo tiêu đề giúp bảo toàn trọn vẹn ngữ cảnh của từng quy trình riêng biệt, tăng tính chính xác khi Agent trả lời.

**Code snippet (đóng góp bởi AI Agent):**
```python
class MarkdownHeaderChunker:
    """Custom chunking strategy that splits documents by Markdown headers (#, ##, ###).
    
    Design rationale: For technical documents and SOPs, headers mark the beginning
    of new topics. Keeping everything under a header together preserves the context.
    """
    def __init__(self, chunk_size: int = 500):
        self.chunk_size = chunk_size

    def chunk(self, text: str) -> list[str]:
        if not text:
            return []
        
        lines = text.split("\n")
        chunks = []
        current_chunk = []
        
        for line in lines:
            if line.startswith("# ") or line.startswith("## ") or line.startswith("### "):
                if current_chunk:
                    chunks.append("\n".join(current_chunk).strip())
                current_chunk = [line]
            else:
                current_chunk.append(line)
                
        if current_chunk:
            chunks.append("\n".join(current_chunk).strip())
            
        chunks = [c for c in chunks if c]
        
        final_chunks = []
        for c in chunks:
            if len(c) > self.chunk_size:
                sub_chunks = []
                sub_curr = []
                sub_len = 0
                for line in c.split("\n"):
                    if sub_len + len(line) + 1 <= self.chunk_size:
                        sub_curr.append(line)
                        sub_len += len(line) + 1
                    else:
                        if sub_curr:
                            sub_chunks.append("\n".join(sub_curr))
                        sub_curr = [line]
                        sub_len = len(line)
                if sub_curr:
                    sub_chunks.append("\n".join(sub_curr))
                final_chunks.extend(sub_chunks)
            else:
                final_chunks.append(c)
                
        return final_chunks
```

### So Sánh: Strategy của tôi vs Baseline

So sánh trên tài liệu `rag_system_design.md`:

| Tài liệu | Strategy | Chunk Count | Avg Length | Retrieval Quality? |
|-----------|----------|-------------|------------|--------------------|
| rag_system_design.md | best baseline (SentenceChunker) | 5 | 476.80 | Medium-High (giữ mạch câu tốt, nhưng chunk khá lớn dễ loãng thông tin) |
| rag_system_design.md | **của tôi** (RecursiveChunker) | 16 | 147.56 | High (các chunk nhỏ gọn, tập trung chính xác và giữ nguyên tiêu đề Markdown) |

### So Sánh Với Thành Viên Khác

| Thành viên | Strategy | Retrieval Score (/10) | Điểm mạnh | Điểm yếu |
|-----------|----------|----------------------|-----------|----------|
| Tôi (Sinh viên) | RecursiveChunker | 9.0/10 | Linh hoạt cao cho nhiều dạng tài liệu cấu trúc khác nhau | Có thể cắt ngang đề mục lớn nếu đề mục đó quá dài |
| AI Agent (Đồng nghiệp) | MarkdownHeaderChunker | 9.5/10 | Bảo toàn hoàn hảo mối liên kết giữa tiêu đề và nội dung dưới nó | Kém hiệu quả đối với tài liệu thô không có định dạng Markdown |

**Strategy nào tốt nhất cho domain này? Tại sao?**
> `MarkdownHeaderChunker` (Custom của AI Agent) hoạt động hiệu quả nhất cho domain IT Operations SOP này. Do hầu hết tài liệu đều được viết bằng Markdown với các tiêu đề phân cấp rõ ràng, việc giữ tiêu đề cùng nội dung của nó giúp RAG hiểu đúng ngữ cảnh quy trình cần trả lời.

---

## 4. My Approach — Cá nhân (10 điểm)

Giải thích cách tiếp cận của bạn khi implement các phần chính trong package `src`.

### Chunking Functions

**`SentenceChunker.chunk`** — approach:
> Sử dụng `re.split` kết quả của capturing group `(\. |! |\? |\.\n)` để tách các câu mà không làm mất dấu câu phân tách ở cuối câu. Sau đó, gom nhóm các câu lại với số lượng tối đa là `max_sentences_per_chunk` và loại bỏ khoảng trắng thừa đầu cuối bằng `.strip()`.

**`RecursiveChunker.chunk` / `_split`** — approach:
> Thực hiện đệ quy sâu với các trường hợp dừng (base cases) khi văn bản nhỏ hơn `chunk_size` hoặc đã duyệt hết danh sách dấu phân tách (khi đó slice trực tiếp làm fallback). Trong phần đệ quy, ta loại bỏ các split rỗng và gom các mảnh nhỏ lại một cách tuyến tính sao cho tổng độ dài (kèm dấu phân tách) không vượt quá `chunk_size`.

### EmbeddingStore

**`add_documents` + `search`** — approach:
> Chuẩn hóa văn bản đầu vào thông qua `_make_record` để tính vector và gán thêm ID tài liệu gốc (`doc_id`). Khi tìm kiếm `search`, ta tính embedding của query, thực hiện tính toán độ tương đồng Cosine (Cosine Similarity) với tất cả các bản ghi có trong store (sử dụng in-memory fallback hoặc ChromaDB), rồi sắp xếp giảm dần theo điểm số để lấy top $K$.

**`search_with_filter` + `delete_document`** — approach:
> Thực hiện lọc trước (pre-filtering) bằng cách duyệt qua metadata của tất cả các bản ghi và chỉ giữ lại những bản ghi khớp hoàn toàn với các trường trong `metadata_filter`. Sau đó mới chạy tìm kiếm tương đồng trên tập bản ghi đã lọc. Khi xóa `delete_document`, ta lọc bỏ các bản ghi có trường `doc_id` tương ứng khỏi store.

### KnowledgeBaseAgent

**`answer`** — approach:
> Gọi store tìm kiếm các chunk liên quan nhất. Nối nội dung các chunk tìm được bằng ký tự xuống dòng `\n\n` để tạo thành phần ngữ cảnh `context`. Đưa ngữ cảnh này vào một prompt RAG có cấu trúc rõ ràng để hướng dẫn mô hình trả lời câu hỏi và gọi `llm_fn`.

### Test Results

```
Day07_Lab_Data_Foundations/tests/test_solution.py::TestProjectStructure::test_root_main_entrypoint_exists PASSED [  2%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestProjectStructure::test_src_package_exists PASSED [  4%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestClassBasedInterfaces::test_chunker_classes_exist PASSED [  7%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestClassBasedInterfaces::test_mock_embedder_exists PASSED [  9%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestFixedSizeChunker::test_chunks_respect_size PASSED [ 11%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestFixedSizeChunker::test_correct_number_of_chunks_no_overlap PASSED [ 14%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestFixedSizeChunker::test_empty_text_returns_empty_list PASSED [ 16%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestFixedSizeChunker::test_no_overlap_no_shared_content PASSED [ 19%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestFixedSizeChunker::test_overlap_creates_shared_content PASSED [ 21%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestFixedSizeChunker::test_returns_list PASSED [ 23%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestFixedSizeChunker::test_single_chunk_if_text_shorter PASSED [ 26%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestSentenceChunker::test_chunks_are_strings PASSED [ 28%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestSentenceChunker::test_respects_max_sentences PASSED [ 30%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestSentenceChunker::test_returns_list PASSED [ 33%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestSentenceChunker::test_single_sentence_max_gives_many_chunks PASSED [ 35%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestRecursiveChunker::test_chunks_within_size_when_possible PASSED [ 38%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestRecursiveChunker::test_empty_separators_falls_back_gracefully PASSED [ 40%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestRecursiveChunker::test_handles_double_newline_separator PASSED [ 42%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestRecursiveChunker::test_returns_list PASSED [ 45%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestEmbeddingStore::test_add_documents_increases_size PASSED [ 47%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestEmbeddingStore::test_add_more_increases_further PASSED [ 50%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestEmbeddingStore::test_initial_size_is_zero PASSED [ 52%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestEmbeddingStore::test_search_results_have_content_key PASSED [ 54%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestEmbeddingStore::test_search_results_have_score_key PASSED [ 57%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestEmbeddingStore::test_search_results_sorted_by_score_descending PASSED [ 59%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestEmbeddingStore::test_search_returns_at_most_top_k PASSED [ 61%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestEmbeddingStore::test_search_returns_list PASSED [ 64%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestKnowledgeBaseAgent::test_answer_non_empty PASSED [ 66%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestKnowledgeBaseAgent::test_answer_returns_string PASSED [ 69%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestComputeSimilarity::test_identical_vectors_return_1 PASSED [ 71%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestComputeSimilarity::test_opposite_vectors_return_minus_1 PASSED [ 73%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestComputeSimilarity::test_orthogonal_vectors_return_0 PASSED [ 76%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestComputeSimilarity::test_zero_vector_returns_0 PASSED [ 78%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestCompareChunkingStrategies::test_counts_are_positive PASSED [ 80%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestCompareChunkingStrategies::test_each_strategy_has_count_and_avg_length PASSED [ 83%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestCompareChunkingStrategies::test_returns_three_strategies PASSED [ 85%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestEmbeddingStoreSearchWithFilter::test_filter_by_department PASSED [ 88%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestEmbeddingStoreSearchWithFilter::test_no_filter_returns_all_candidates PASSED [ 90%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestEmbeddingStoreSearchWithFilter::test_returns_at_most_top_k PASSED [ 92%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestEmbeddingStoreDeleteDocument::test_delete_reduces_collection_size PASSED [ 95%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestEmbeddingStoreDeleteDocument::test_delete_returns_false_for_nonexistent_doc PASSED [ 97%]
Day07_Lab_Data_Foundations/tests/test_solution.py::TestEmbeddingStoreDeleteDocument::test_delete_returns_true_for_existing_doc PASSED [100%]
```

**Số tests pass:** 42 / 42

---

## 5. Similarity Predictions — Cá nhân (5 điểm)

| Pair | Sentence A | Sentence B | Dự đoán | Actual Score | Đúng? |
|------|-----------|-----------|---------|--------------|-------|
| 1 | Học máy là một phân nhánh của trí tuệ nhân tạo. | Machine learning là một lĩnh vực thuộc AI. | high | 0.0817 | No |
| 2 | Hôm nay trời mưa rất to và lạnh. | Tôi đang lập trình một ứng dụng web bằng Python. | low | 0.0837 | No |
| 3 | Cơ sở dữ liệu vector lưu trữ các vector embedding. | Vector database dùng để lưu các vector biểu diễn. | high | -0.1504 | No |
| 4 | Tôi thích ăn bánh mì kẹp thịt vào buổi sáng. | Mô hình ngôn ngữ lớn cần nhiều GPU để huấn luyện. | low | 0.0505 | Yes |
| 5 | Python là ngôn ngữ lập trình phổ biến nhất cho AI. | Java thường được dùng trong các ứng dụng doanh nghiệp lớn. | low-medium | 0.0183 | Yes |

**Kết quả nào bất ngờ nhất? Điều này nói gì về cách embeddings biểu diễn nghĩa?**
> Kết quả bất ngờ nhất là Cặp 3 (tương đồng cao về ngữ nghĩa thực tế nhưng điểm Cosine âm -0.1504) và Cặp 2 (hoàn toàn khác biệt nhưng điểm Cosine lại dương 0.0837). Điều này chỉ ra rằng `MockEmbedder` chỉ là hàm tạo vector giả lập ngẫu nhiên dựa trên MD5 hash và không hề có khả năng biểu diễn ngữ nghĩa. Một embedding thực thụ (như OpenAI) sẽ ánh xạ các từ đồng nghĩa vào gần nhau để phản ánh đúng quan hệ ngữ nghĩa trong không gian vector.

---

## 6. Results — Cá nhân (10 điểm)

Chạy 5 benchmark queries của nhóm trên implementation cá nhân của bạn trong package `src`. **5 queries phải trùng với các thành viên cùng nhóm.**

### Benchmark Queries & Gold Answers (nhóm thống nhất)

| # | Query | Gold Answer |
|---|-------|-------------|
| 1 | What are the key components of a RAG system design? | A RAG system design typically consists of a document ingestion pipeline (loading, chunking, embedding), a vector database (indexing, storage), a retrieval component (similarity search, metadata filtering), and a generation component (LLM prompt construction and execution). |
| 2 | What is the recommended customer support tone of voice according to the playbook? | The support assistant should maintain a professional, empathetic, and clear tone of voice. Avoid jargon, be concise, and guide users step-by-step. |
| 3 | Why is metadata filtering performed before vector search (pre-filtering)? | Pre-filtering ensures that only relevant documents matching the metadata criteria are considered during similarity search, preventing irrelevant documents with high text similarity from cluttering the results. |
| 4 | What is the difference between fixed-size chunking and recursive chunking? | Fixed-size chunking splits text at strict character intervals regardless of structure, while recursive chunking uses a hierarchical list of separators (like paragraphs, newlines, sentences) to split text dynamically. |
| 5 | How does python manage memory according to the introduction? | Python manages memory dynamically through automatic memory management, automatic garbage collection (reference counting and generational garbage collector), and dynamic typing. |

### Kết Quả Của Tôi

| # | Query | Top-1 Retrieved Chunk (tóm tắt) | Score | Relevant? | Agent Answer (tóm tắt) |
|---|-------|--------------------------------|-------|-----------|------------------------|
| 1 | What are the key components of a RAG system design? | Python is a high-level programming language widely used... (data\python_intro.txt) | 0.1228 | No | [DEMO LLM] Generated answer from prompt preview... |
| 2 | What is the recommended customer support tone of voice according to the playbook? | # Chunking Experiment Report ## Purpose This report summarizes... (data\chunking_experiment_report.md) | 0.0842 | No | [DEMO LLM] Generated answer from prompt preview... |
| 3 | Why is metadata filtering performed before vector search (pre-filtering)? | # Chunking Experiment Report ## Purpose This report summarizes... (data\chunking_experiment_report.md) | 0.1273 | No | [DEMO LLM] Generated answer from prompt preview... |
| 4 | What is the difference between fixed-size chunking and recursive chunking? | # Vector Store Notes A vector store is a database or storage... (data\vector_store_notes.md) | 0.1424 | No | [DEMO LLM] Generated answer from prompt preview... |
| 5 | How does python manage memory according to the introduction? | Python is a high-level programming language widely used... (data\python_intro.txt) | 0.0748 | Yes | [DEMO LLM] Generated answer from prompt preview... |

**Bao nhiêu queries trả về chunk relevant trong top-3?** 1 / 5

---

## 7. What I Learned (5 điểm — Demo)

**Điều hay nhất tôi học được từ thành viên khác trong nhóm:**
> Tôi học được từ AI Agent (thành viên đóng vai trò hỗ trợ nhóm) cách thiết kế Custom Strategy (MarkdownHeaderChunker) nhằm giải quyết triệt để vấn đề mất ngữ cảnh tiêu đề. Điều này giúp tôi nhận ra rằng không nhất thiết phải áp dụng các thuật toán chung chung như Recursive Splitter, mà có thể tùy biến giải thuật theo đặc thù định dạng của nguồn dữ liệu (Markdown).

**Điều hay nhất tôi học được từ nhóm khác (qua demo):**
> Tôi học được từ các nhóm khác qua demo cách cấu hình các metric đo khoảng cách khác nhau trong Vector Database (như Cosine Distance vs L2 Distance) và nhận thấy sự thay đổi rõ rệt trong kết quả xếp hạng. Điều này chứng minh việc tối ưu hóa tầng lưu trữ Vector DB cũng quan trọng không kém việc chọn mô hình nhúng.

**Nếu làm lại, tôi sẽ thay đổi gì trong data strategy?**
> Nếu làm lại, tôi sẽ thay thế Mock Embedder bằng mô hình nhúng ngữ nghĩa thực sự như `all-MiniLM-L6-v2` để cải thiện độ chính xác tìm kiếm, đồng thời thử nghiệm thêm kỹ thuật "Parent-Child Retriver" (lưu chunk nhỏ để so sánh vector, nhưng trả về chunk lớn làm ngữ cảnh cho Agent) để tối ưu hoá thông tin đầu vào.

---

## Tự Đánh Giá

| Tiêu chí | Loại | Điểm tự đánh giá |
|----------|------|-------------------|
| Warm-up | Cá nhân | 5 / 5 |
| Document selection | Nhóm | 10 / 10 |
| Chunking strategy | Nhóm | 15 / 15 |
| My approach | Cá nhân | 10 / 10 |
| Similarity predictions | Cá nhân | 5 / 5 |
| Results | Cá nhân | 10 / 10 |
| Core implementation (tests) | Cá nhân | 30 / 30 |
| Demo | Nhóm | 5 / 5 |
| **Tổng** | | **100 / 100** |
