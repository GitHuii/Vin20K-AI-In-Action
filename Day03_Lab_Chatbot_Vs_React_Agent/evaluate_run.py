import os
from dotenv import load_dotenv
from src.core.gemini_provider import GeminiProvider
from src.agent.agent import ReActAgent
from src.tools.custom_tools import TOOLS_MANIFEST

def main():
    load_dotenv()
    
    api_key = os.getenv("GEMINI_API_KEY")
    model_name = os.getenv("DEFAULT_MODEL", "gemini-3.5-flash")
    
    if not api_key or api_key == "your_gemini_api_key_here":
        print("❌ Lỗi: Chưa cấu hình GEMINI_API_KEY trong file .env")
        return
        
    provider = GeminiProvider(model_name=model_name, api_key=api_key)
    
    query = "Tôi muốn mua 2 chiếc iPhone sử dụng mã giảm giá 'WINNER' và ship về Hà Nội. Tổng chi phí là bao nhiêu?"
    
    print("="*60)
    print(" CHẠY THỬ PHẦN 1: CHATBOT BASELINE")
    print("="*60)
    print(f"Câu hỏi: {query}\n")
    try:
        response = provider.generate(query)
        print("Chatbot Baseline Trả lời:")
        print(response["content"])
    except Exception as e:
        print(f"Lỗi khi chạy Chatbot: {e}")
        
    print("\n" + "="*60)
    print(" CHẠY THỬ PHẦN 2: REACT AGENT V1")
    print("="*60)
    print(f"Câu hỏi: {query}\n")
    
    try:
        agent = ReActAgent(llm=provider, tools=TOOLS_MANIFEST, max_steps=8) # Tăng max_steps lên 8 để thoải mái suy luận
        answer = agent.run(query)
        print("\nFinal Answer từ Agent:")
        print(answer)
    except Exception as e:
        print(f"Lỗi khi chạy Agent: {e}")
    print("="*60)

if __name__ == "__main__":
    main()
