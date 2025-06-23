1. Frontend (User Interface)
Files: chat.html, app.js, style.css
How it works:
The user opens chat.html, which shows:
A login modal (email + password)
A chat window for conversation
Login:
User enters email and password in the modal.
On submit, JavaScript (app.js) sends a POST request to /api/chat/login with the credentials.
If successful, the modal closes and a banner shows the login info.
Chat:
User types a message and submits the chat form.
JavaScript sends the message to the backend at /api/chat.
The response from the backend (bot reply) is shown in the chat window.
If the bot response includes login info, the banner updates accordingly.
2. Backend (Spring Boot Application)
Main entry: ChatAssistantApplication.java (starts the Spring Boot app)
Controllers: ChatController.java
Endpoints:
POST /api/chat — Receives chat messages, returns bot responses.
POST /api/chat/login — Receives login info, simulates login, updates session.
GET /api/chat/session — Returns current session info (login state, email, site).
Service: ChatService.java
Main logic:
When a chat message is received, it is sent to a local Ollama LLM server (http://localhost:11434/api/chat) using the Llama 3 model.
The backend includes a special system prompt so the LLM knows to output a JSON object for login actions (extracting site, email, password).
The backend parses the LLM’s response:
If it finds a JSON with "action": "login", it simulates a login (sets session attributes).
If it finds a JSON with "action": "register", it simulates registration.
Otherwise, it just returns the LLM’s text.
If the user is logged in, the response includes a note like [Logged in as ...] for the frontend to display.
3. Session Handling
The backend uses HTTP sessions to remember if a user is “logged in” and their email/site.
No real authentication is performed; it’s all simulated for demonstration.
4. LLM Integration
The backend talks to a local Ollama server running Llama 3.
The LLM is prompted to output structured JSON for automation commands (like login/register).
The backend extracts and acts on these commands if present.
5. Configuration
The app is configured as a standard Spring Boot app (application.properties just sets the name).
Dependencies are managed with Maven (pom.xml).
JSON:
{
  "action": "login",
  "site": "example.com",
  "email": "test@example.com",
  "password": "1234"
}