# 🧠 Smart CLI Assistant (MCP-based)

A minimal AI-powered CLI assistant that converts natural language into safe terminal commands using an LLM + tool execution layer.

> "Create a React app and install Tailwind"
→ Generates commands → asks for confirmation → executes safely

---

## 🚀 Features

- 🔤 Natural language → shell commands
- 🛠 MCP-style tool architecture
- 🔐 Safety validation (blocks dangerous commands)
- 👤 Human-in-the-loop confirmation
- ⚡ Fast and lightweight CLI interface

---

## 🏗 Architecture

User Input → LLM → Command Validator → Confirmation → Shell Executor → Output

---

## 📁 Project Structure
smart-cli-agent/
├── main.py
├── llm.py
├── tools/
│ ├── shell.py
│ └── file.py
├── utils/
│ ├── validator.py
│ └── confirm.py
├── prompts/
│ └── system_prompt.txt
├── requirements.txt
└── README.md


---

## ⚙️ Setup

### 1. Clone the repo
```bash
git clone https://github.com/your-username/smart-cli-agent.git
cd smart-cli-agent

pip install -r requirements.txt