from __future__ import annotations

import math
from typing import Any


def safe_eval_math(expression: str = "") -> dict[str, Any]:
    # Use clean, allowed math names
    allowed_names = {k: v for k, v in math.__dict__.items() if not k.startswith("__")}
    allowed_names.update({
        "abs": abs,
        "round": round,
        "min": min,
        "max": max,
        "pow": pow,
    })
    
    try:
        # Normalize python exponent operator
        clean_expr = expression.replace("^", "**").strip()
        
        # Basic validation: ensure only numbers, arithmetic operators, parentheses, and alphabetical characters (for math functions)
        allowed_chars = set("0123456789+-*/()., \t_")
        for char in clean_expr:
            if char not in allowed_chars and not char.isalpha():
                raise ValueError(f"Character '{char}' is not allowed in math expression.")
                
        # Evaluate within a sandbox containing no builtins and only allowed math operations
        result = eval(clean_expr, {"__builtins__": None}, allowed_names)
        
        if result is None:
            raise ValueError("Expression evaluated to None.")
            
        return {
            "tool": "calculator",
            "status": "success",
            "expression": expression,
            "result": float(result)
        }
    except Exception as exc:
        return {
            "tool": "calculator",
            "status": "error",
            "message": f"{type(exc).__name__}: {str(exc)}"
        }
