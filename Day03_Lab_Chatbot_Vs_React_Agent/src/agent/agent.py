import os
import re
import json
from typing import List, Dict, Any, Optional
from src.core.llm_provider import LLMProvider
from src.telemetry.logger import logger
from src.telemetry.metrics import tracker

class ReActAgent:
    """
    Agent v2 (Improved) tuân thủ vòng lặp Thought-Action-Observation.
    Cải tiến khả năng parse positional/keyword arguments linh hoạt và tối ưu hóa Prompt Few-shot.
    """
    
    def __init__(self, llm: LLMProvider, tools: List[Dict[str, Any]], max_steps: int = 5):
        self.llm = llm
        self.tools = tools
        self.max_steps = max_steps
        self.history = []

    def get_system_prompt(self) -> str:
        """
        Tạo prompt hệ thống chứa danh sách công cụ, quy tắc định dạng và ví dụ Few-Shot (Agent v2).
        """
        tool_descriptions = "\n".join([f"- {t['name']}: {t['description']}" for t in self.tools])
        return f"""Bạn là một Trợ lý mua sắm trực tuyến thông minh. Bạn có quyền sử dụng các công cụ sau để giúp người dùng trả lời câu hỏi:

{tool_descriptions}

Khi nhận được câu hỏi từ người dùng, bạn PHẢI tuân thủ nghiêm ngặt quy trình suy luận sau:
1. Đưa ra suy nghĩ (Thought) về bước cần làm tiếp theo.
2. Đưa ra hành động (Action) để gọi công cụ phù hợp với định dạng: tool_name(tham_số)
3. Sau khi nhận được kết quả (Observation) từ công cụ, bạn tiếp tục đưa ra suy nghĩ và hành động tiếp theo nếu cần.
4. Khi đã có đủ thông tin để trả lời câu hỏi của người dùng, bạn PHẢI đưa ra câu trả lời cuối cùng với định dạng: Final Answer: câu trả lời chi tiết của bạn.

Chú ý quan trọng:
- Phải gọi công cụ đúng định dạng: tool_name(arguments). Ví dụ: check_stock(item_name="iPhone") hoặc calc_shipping(weight_kg=0.2, destination="Hà Nội").
- Mỗi lượt trả lời, bạn chỉ được phép thực hiện DUY NHẤT một hành động Action.
- Sau dòng Action, bạn không được tự ý viết Observation, hệ thống sẽ cung cấp nó cho bạn ở lượt lặp kế tiếp.
- Chỉ đưa ra Final Answer khi bạn đã có kết quả thực tế từ các công cụ (không được đoán hoặc bịa đặt giá cả, tồn kho hay phí ship).

Dưới đây là một ví dụ suy luận ReAct mẫu:
Question: Tôi muốn mua 1 chiếc MacBook áp dụng mã WELCOME và ship về Hà Nội. Tổng tiền là bao nhiêu?
Thought: Tôi cần kiểm tra giá và tồn kho của MacBook trước.
Action: check_stock(item_name="MacBook")
Observation: {{"status": "success", "item": "MacBook", "price_vnd": 35000000, "stock": 2, "weight_kg": 1.5}}
Thought: Tôi đã biết giá MacBook là 35.000.000 VND và nặng 1.5 kg. Tiếp theo, tôi cần tra cứu mã giảm giá 'WELCOME'.
Action: get_discount(coupon_code="WELCOME")
Observation: {{"status": "success", "coupon": "WELCOME", "discount_percent": 10, "description": "Giảm 10%"}}
Thought: Mã giảm giá WELCOME được giảm 10%. Bây giờ tôi cần tính phí ship cho MacBook nặng 1.5 kg về Hà Nội.
Action: calc_shipping(weight_kg=1.5, destination="Hà Nội")
Observation: {{"status": "success", "destination": "Hà Nội", "weight_kg": 1.5, "shipping_cost_vnd": 40000}}
Thought: Tôi đã có đủ thông tin: giá MacBook là 35.000.000 VND, giảm 10% (giảm 3.500.000 VND, còn lại 31.500.000 VND), phí ship là 40.000 VND. Tổng cộng là 31.540.000 VND. Tôi sẽ trả lời người dùng.
Final Answer: Tổng chi phí cho đơn hàng mua 1 chiếc MacBook của bạn khi áp dụng mã WELCOME và ship về Hà Nội là **31.540.000 VND**. 
Chi tiết: Tiền MacBook sau giảm 10% là 31.500.000 VND, phí ship về Hà Nội là 40.000 VND.

Hãy bắt đầu!
"""

    def run(self, user_input: str) -> str:
        """
        Thực thi vòng lặp ReAct v2.
        """
        logger.log_event("AGENT_START", {"input": user_input, "model": self.llm.model_name})
        
        current_prompt = f"Question: {user_input}"
        steps = 0
        final_response = "Không thể tìm thấy câu trả lời cuối cùng do đạt giới hạn số bước."

        while steps < self.max_steps:
            steps += 1
            logger.log_event("AGENT_STEP_START", {"step": steps})
            
            # Gọi LLM sinh phản hồi
            result = self.llm.generate(current_prompt, system_prompt=self.get_system_prompt())
            response_content = result["content"]
            
            # Ghi nhận metric vào telemetry
            tracker.track_request(
                provider=result["provider"],
                model=self.llm.model_name,
                usage=result["usage"],
                latency_ms=result["latency_ms"]
            )
            
            logger.log_event("AGENT_LLM_RESPONSE", {"step": steps, "response": response_content})
            print(f"\n--- [Bước {steps}] LLM sinh phản hồi: ---\n{response_content}")
            
            # Cập nhật prompt
            current_prompt += f"\n{response_content}"
            
            # Parse Thought / Action / Final Answer
            action_match = re.search(r'Action:\s*(\w+)\((.*)\)', response_content)
            final_answer_match = re.search(r'Final Answer:\s*(.*)', response_content, re.DOTALL)
            
            if action_match:
                tool_name = action_match.group(1)
                tool_args = action_match.group(2)
                
                # Thực thi công cụ
                logger.log_event("TOOL_CALL", {"tool": tool_name, "args": tool_args})
                observation = self._execute_tool(tool_name, tool_args)
                logger.log_event("TOOL_OBSERVATION", {"tool": tool_name, "result": observation})
                
                print(f"Observation: {observation}")
                
                # Nối Observation vào prompt
                current_prompt += f"\nObservation: {observation}"
                
            elif final_answer_match:
                final_response = final_answer_match.group(1).strip()
                logger.log_event("AGENT_FINAL_ANSWER", {"answer": final_response})
                break
            else:
                # Nếu không tìm thấy Action hay Final Answer, coi toàn bộ nội dung là câu trả lời
                final_response = response_content.strip()
                logger.log_event("AGENT_PARSE_FALLBACK", {"text": final_response})
                break
                
        logger.log_event("AGENT_END", {"steps": steps, "success": steps < self.max_steps})
        return final_response

    def _parse_args(self, args_str: str) -> Any:
        """
        Agent v2: Parse đối số linh hoạt hỗ trợ JSON, kwargs (key=value) và positional args (danh sách phân tách bởi dấu phẩy).
        """
        args_str = args_str.strip()
        if not args_str:
            return []
            
        # 1. Thử parse JSON
        try:
            parsed = json.loads(args_str)
            if isinstance(parsed, dict) or isinstance(parsed, list):
                return parsed
        except json.JSONDecodeError:
            pass
            
        # 2. Thử parse dạng key=value (kwargs) (ví dụ: item_name="iPhone", weight_kg=0.2)
        pattern_kwargs = r'(\w+)\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|([^\s,]+))'
        matches_kwargs = re.findall(pattern_kwargs, args_str)
        if matches_kwargs:
            kwargs = {}
            for match in matches_kwargs:
                key = match[0]
                val = match[1] or match[2] or match[3]
                try:
                    if '.' in val:
                        kwargs[key] = float(val)
                    else:
                        kwargs[key] = int(val)
                except ValueError:
                    if val.lower() == "true":
                        kwargs[key] = True
                    elif val.lower() == "false":
                        kwargs[key] = False
                    else:
                        kwargs[key] = val
            return kwargs
            
        # 3. Thử parse positional arguments (args) phân tách bằng dấu phẩy (ví dụ: 0.4, "Hà Nội")
        pattern_args = r'(?:"([^"]*)"|\'([^\']*)\'|([^\s,]+))'
        matches_args = re.findall(pattern_args, args_str)
        if matches_args:
            args_list = []
            for match in matches_args:
                val = match[0] or match[1] or match[2]
                if not val:
                    continue
                val = val.strip()
                try:
                    if '.' in val:
                        args_list.append(float(val))
                    else:
                        args_list.append(int(val))
                except ValueError:
                    if val.lower() == "true":
                        args_list.append(True)
                    elif val.lower() == "false":
                        args_list.append(False)
                    else:
                        args_list.append(val)
            if len(args_list) == 1:
                return args_list[0]
            return args_list
            
        return args_str

    def _execute_tool(self, tool_name: str, args_str: str) -> str:
        """
        Thực thi công cụ theo tên, hỗ trợ unpack đối số (list/dict) linh hoạt và bắt lỗi chi tiết.
        """
        for tool in self.tools:
            if tool['name'] == tool_name:
                try:
                    parsed_args = self._parse_args(args_str)
                    if isinstance(parsed_args, dict):
                        result = tool['func'](**parsed_args)
                    elif isinstance(parsed_args, list):
                        result = tool['func'](*parsed_args)
                    else:
                        result = tool['func'](parsed_args)
                    return str(result)
                except Exception as e:
                    return f"Error executing {tool_name}: {e}. Please check your arguments."
        return f"Tool {tool_name} not found."
