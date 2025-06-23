# 📝 Assignment: Simple Web App with LLM-Driven Automation

## 🎯 Goal
Create a minimal web application with:
- A **login page** (email + password)
- A **chat interface** where the user can talk to an LLM
- Integration with **Ollama running LLaMA 3** model via HTTP API
- Ability to interpret commands like:
  > "Направи ми регистрация с email test@example.com в example.com"

  ...and automatically perform the action (e.g., simulate or send HTTP registration request)

---

## 📦 Requirements

### 1. Technologies
- Frontend: Simple HTML/CSS/JS or React (if needed)
- Backend: Spring Boot
- LLM API: Use local **Ollama server** via HTTP (assume it has `/api/chat` or similar endpoint)

### 2. Functionality

#### 🧑‍💻 Login Page
- Fields: email, password
- No real auth required — just fake validation

#### 💬 Chat Page
- Simple chat UI with user + bot messages
- When user sends a message, it is sent to Ollama
- Response is shown in UI

#### 🧠 Automation
- If LLM responds with structured instruction (JSON or function call), the backend should parse and execute it
- Supported command: `register` with fields: `site`, `email`, `password`
- Simulation: Just log it or return "Account created at SITE"

---

## 🧪 Example

**User Message:**
