---
name: calculator
track: custom
kind: utility
provider: Python Math Library
requires_env: []
inputs: [expression]
outputs: [result, status]
side_effect: false
---
# calculator

Evaluates a basic mathematical expression safely (e.g. "2 + 2", "sin(pi/2)"). Supports basic operators (+, -, *, /, **, parenthesises) and math functions (sin, cos, tan, pi, e, etc.).
