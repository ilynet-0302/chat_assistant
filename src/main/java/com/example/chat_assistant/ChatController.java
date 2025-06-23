package com.example.chat_assistant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> payload, HttpSession session) {
        String message = payload.get("message");
        String response = chatService.getLLMResponse(message, session);
        return ResponseEntity.ok(Map.of("response", response));
    }

    @GetMapping("/session")
    public Map<String, Object> sessionInfo(HttpSession session) {
        boolean loggedIn = Boolean.TRUE.equals(session.getAttribute("loggedIn"));
        String email = (String) session.getAttribute("email");
        String site = (String) session.getAttribute("site");
        Map<String, Object> result = new HashMap<>();
        result.put("loggedIn", loggedIn);
        result.put("email", email);
        result.put("site", site);
        return result;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> payload, HttpSession session) {
        String email = payload.get("email");
        String password = payload.get("password");
        // For simulation, extract site from email domain or use a default
        String site = "example.com";
        if (email != null && email.contains("@")) {
            String[] parts = email.split("@");
            if (parts.length == 2) site = parts[1];
        }
        session.setAttribute("loggedIn", true);
        session.setAttribute("email", email);
        session.setAttribute("site", site);
        // (Don't store password in session for security, even in simulation)
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("email", email);
        result.put("site", site);
        return result;
    }
} 