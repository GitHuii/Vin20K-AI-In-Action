import os
from dotenv import load_dotenv
from src.core.gemini_provider import GeminiProvider
from src.core.openai_provider import OpenAIProvider
from src.telemetry.logger import logger
from src.telemetry.metrics import tracker

def main():
    # Load environment variables
    load_dotenv()
    
    provider_name = os.getenv("DEFAULT_PROVIDER", "google").lower()
    model_name = os.getenv("DEFAULT_MODEL", "gemini-1.5-flash")
    
    print(f"--- Khởi chạy Chatbot Baseline ({provider_name} | {model_name}) ---")
    
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
        print(f"❌ Lỗi: Nhà cung cấp {provider_name} không hỗ trợ hoặc chưa cấu hình.")
        return

    logger.log_event("CHATBOT_START", {"model": model_name, "provider": provider_name})

    print("Nhập 'exit' hoặc 'quit' để thoát.\n")
    
    while True:
        try:
            user_input = input("User: ")
            if user_input.strip().lower() in ["exit", "quit"]:
                break
                
            if not user_input.strip():
                continue
                
            print("Chatbot: ", end="", flush=True)
            
            # Ghi nhận thời gian và log event
            logger.log_event("USER_QUERY", {"query": user_input})
            
            # Gọi LLM generate
            response = provider.generate(user_input)
            
            print(response["content"])
            
            # Track request metrics
            tracker.track_request(
                provider=response["provider"],
                model=model_name,
                usage=response["usage"],
                latency_ms=response["latency_ms"]
            )
            print() # Dòng trống phân cách các câu hỏi
            
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"\n❌ Đã xảy ra lỗi: {e}")
            logger.error(f"Chatbot error: {e}")
            
    logger.log_event("CHATBOT_END", {})
    print("\n--- Đã thoát Chatbot ---")

if __name__ == "__main__":
    main()
