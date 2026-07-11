import streamlit as st
import os
import sys
import json
from pathlib import Path
from datetime import datetime

# Add root to sys.path
ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT))

from env_loader import load_lab_env
from providers import make_provider
from tools import load_tool_declarations, to_openai_tools
from chat import execute_tool_call, trim_history, assistant_tool_message, tool_results_message

load_lab_env(ROOT)

# Page configuration with custom style
st.set_page_config(page_title="AI Research Agent (C401)", page_icon="🕵️‍♂️", layout="centered")

# Custom CSS for modern premium design
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;700&display=swap');
    
    html, body, [data-testid="stAppViewContainer"] {
        font-family: 'Inter', sans-serif;
    }
    
    .title-container {
        text-align: center;
        padding: 20px 0;
        margin-bottom: 25px;
    }
    
    .title-text {
        font-family: 'Outfit', sans-serif;
        font-weight: 700;
        font-size: 2.6rem;
        background: linear-gradient(90deg, #60a5fa 0%, #34d399 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 5px;
    }
    
    .subtitle-text {
        color: #8888a0;
        font-size: 1.1rem;
        font-weight: 400;
    }
    
    /* Tool calling box style */
    .tool-call-box {
        background-color: #1e1e2f;
        border-left: 4px solid #10b981;
        padding: 10px 15px;
        margin: 8px 0;
        border-radius: 6px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.9em;
        color: #a7f3d0;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
</style>
""", unsafe_allow_html=True)

# App Title
st.markdown("""
<div class="title-container">
    <div class="title-text">🕵️‍♂️ AI Research Agent</div>
    <div class="subtitle-text">Hệ thống Đại lý Tìm kiếm & Phân tích Đa năng (Lab 04 - C401)</div>
</div>
""", unsafe_allow_html=True)

# Initialize Session States
if "history" not in st.session_state:
    st.session_state.history = []

if "provider" not in st.session_state:
    st.session_state.provider = make_provider("gemini")

if "openai_tools" not in st.session_state:
    tool_declarations = load_tool_declarations(ROOT / "artifacts" / "tools.yaml")
    st.session_state.openai_tools = to_openai_tools(tool_declarations)

if "system_prompt" not in st.session_state:
    st.session_state.system_prompt = (ROOT / "artifacts" / "system_prompt.md").read_text(encoding="utf-8")

# Display history
for msg in st.session_state.history:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# User input
user_input = st.chat_input("Hỏi gì đó (ví dụ: 'Tin AI hôm nay có gì?', 'Tính 15 * 4 - 3')...")

if user_input:
    # Display user chat bubble
    with st.chat_message("user"):
        st.markdown(user_input)
    st.session_state.history.append({"role": "user", "content": user_input})
    
    # Prepare messages context
    messages = [
        {"role": "system", "content": st.session_state.system_prompt},
        *trim_history(st.session_state.history[:-1], window=5),
        {"role": "user", "content": user_input}
    ]
    
    # Run Agent Loop
    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        status_container = st.container()
        
        try:
            working_messages = list(messages)
            max_tool_rounds = 4
            assistant_text = ""
            
            for round_index in range(1, max_tool_rounds + 1):
                response = st.session_state.provider.complete(
                    working_messages, 
                    st.session_state.openai_tools, 
                    model="gemini-3.1-flash-lite", 
                    temperature=0.0
                )
                calls = response.tool_calls
                
                if not calls:
                    assistant_text = response.text or ""
                    break
                
                # Print tool calls dynamically on Streamlit UI
                for call in calls:
                    with status_container:
                        st.markdown(f"""
                        <div class="tool-call-box">
                            ⚡ [Vòng {round_index}] Gọi công cụ: <b>{call.name}</b><br/>
                            <code>args: {json.dumps(call.args, ensure_ascii=False)}</code>
                        </div>
                        """, unsafe_allow_html=True)
                    
                    # Execute tool call
                    event = execute_tool_call(call)
                    
                    # Show result preview
                    with status_container:
                        st.caption(f"↳ Kết quả {call.name}: {json.dumps(event.get('result', {}))[:300]}...")
                    
                    result = event.get("result", {})
                    # Detect clarify/awaiting user
                    if isinstance(result, dict) and result.get("awaiting_user"):
                        assistant_text = result.get("question") or call.args.get("question") or "Vui lòng bổ sung thêm thông tin."
                        break
                
                if isinstance(result, dict) and result.get("awaiting_user"):
                    break
                    
                working_messages.append(assistant_tool_message(response.text, calls))
                working_messages.append(tool_results_message([event]))
            
            # Display final text
            message_placeholder.markdown(assistant_text)
            st.session_state.history.append({"role": "assistant", "content": assistant_text})
            
        except Exception as e:
            st.error(f"Lỗi hệ thống: {str(e)}")
