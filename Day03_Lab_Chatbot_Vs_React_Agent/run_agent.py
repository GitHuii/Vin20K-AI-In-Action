import os
from dotenv import load_dotenv
from src.core.gemini_provider import GeminiProvider
from src.core.openai_provider import OpenAIProvider
from src.agent.agent import ReActAgent
from src.tools.custom_tools import TOOLS_MANIFEST
from src.telemetry.logger import logger

def main():
    # Load environment variables
    load_dotenv()
    
    provider_name = os.getenv("DEFAULT_PROVIDER", "google").lower()
    model_name = os.getenv("DEFAULT_MODEL", "gemini-3.5-flash")
    
    print(f"--- Khởi chạy ReAct Agent v1 ({provider_name} | {model_name}) ---")
    
    # Initialize Provider
    if provider_name == "google":
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "your_gemini_api_key_here":
            print("❌ Lỗi: Chưa cấu hình GEMINI_API_KEY trong file .env")
            return
        provider = GeminiProvider(model_name=model_name, api_key=api_key)
    elif provider_name == "openai":
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key or api_key == "your_openai_api_key_here":
            print("❌ Lỗi: Chưa cấu hình OPENAI_API_KEY trong file .env")
            return
        provider = OpenAIProvider(model_name=model_name, api_key=api_key)
    else:
        print(f"❌ Lỗi: Nhà cung cấp {provider_name} không hỗ trợ.")
        return

    # Khởi tạo Agent với các tool đã thiết kế
    agent = ReActAgent(llm=provider, tools=TOOLS_MANIFEST, max_steps=5)
    
    print("Nhập 'exit' hoặc 'quit' để thoát.\n")
    
    while True:
        try:
            user_input = input("User: ")
            if user_input.strip().lower() in ["exit", "quit"]:
                break
                
            if not user_input.strip():
                continue
            
            # Gửi câu hỏi cho Agent suy luận
            answer = agent.run(user_input)
            
            print(f"\nFinal Answer: {answer}")
            print() # Dòng trống phân cách các câu hỏi
            
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"\n❌ Đã xảy ra lỗi: {e}")
            logger.error(f"Agent CLI error: {e}")
            
    print("\n--- Đã thoát Agent ---")

if __name__ == "__main__":
    main()
