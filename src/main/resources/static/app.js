// Modal logic
const loginModal = document.getElementById('loginModal');
const showLoginBtn = document.getElementById('showLoginBtn');
const closeLoginModal = document.getElementById('closeLoginModal');

if (loginModal && showLoginBtn && closeLoginModal) {
    // Show modal by default
    loginModal.style.display = 'block';
    // Show modal when button clicked
    showLoginBtn.onclick = function() {
        loginModal.style.display = 'block';
    };
    // Hide modal when X clicked
    closeLoginModal.onclick = function() {
        loginModal.style.display = 'none';
    };
    // Hide modal when clicking outside modal content
    window.onclick = function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
    };
}

// Login logic
if (document.getElementById('loginForm')) {
    const loginInfoDiv = document.getElementById('loginInfo');
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const errorDiv = document.getElementById('loginError');
        if (!email || !password) {
            errorDiv.textContent = 'Please enter both email and password.';
            return;
        }
        errorDiv.textContent = '';
        // Call backend to set session
        fetch('/api/chat/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            loginModal.style.display = 'none';
            // Update login info banner
            if (loginInfoDiv && data.success && data.email && data.site) {
                loginInfoDiv.textContent = `Logged in as ${data.email} at ${data.site}`;
                loginInfoDiv.style.display = 'block';
            }
        });
    });
}

// Chat logic
if (document.getElementById('chatForm')) {
    const chatWindow = document.getElementById('chatWindow');
    const loginInfoDiv = document.getElementById('loginInfo');
    document.getElementById('chatForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        if (!message) return;
        appendMessage('user', message);
        input.value = '';
        // Send to backend (placeholder URL)
        fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        })
        .then(res => res.json())
        .then(data => {
            appendMessage('bot', data.response || 'No response');
        })
        .catch(() => {
            appendMessage('bot', 'Error contacting server.');
        });
    });

    function appendMessage(sender, text) {
        // Check for login info in bot response
        if (sender === 'bot' && loginInfoDiv) {
            const loginMatch = text.match(/\[Logged in as (.+?) at (.+?)\]/);
            if (loginMatch) {
                loginInfoDiv.textContent = `Logged in as ${loginMatch[1]} at ${loginMatch[2]}`;
                loginInfoDiv.style.display = 'block';
                // Remove the login info from the chat message
                text = text.replace(/\n*\[Logged in as .+? at .+?\]/, '');
            }
        }
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message ' + sender;
        msgDiv.textContent = text;
        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        // After login via chat, update login info banner
        if (sender === 'bot' && text.includes('You are now logged in!')) {
            fetch('/api/chat/session')
                .then(res => res.json())
                .then(data => {
                    if (loginInfoDiv && data.loggedIn && data.email && data.site) {
                        loginInfoDiv.textContent = `Logged in as ${data.email} at ${data.site}`;
                        loginInfoDiv.style.display = 'block';
                    }
                });
        }
    }
}

// On page load, check login state
document.addEventListener('DOMContentLoaded', function() {
    const loginInfoDiv = document.getElementById('loginInfo');
    if (loginInfoDiv) {
        fetch('/api/chat/session')
            .then(res => res.json())
            .then(data => {
                console.log('Session info:', data); // Debug log
                if (data.loggedIn && data.email && data.site) {
                    loginInfoDiv.textContent = `Logged in as ${data.email} at ${data.site}`;
                    loginInfoDiv.style.display = 'block';
                } else {
                    loginInfoDiv.textContent = '';
                    loginInfoDiv.style.display = 'none';
                }
            });
    }
}); 