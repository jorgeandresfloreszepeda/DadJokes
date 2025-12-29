// Hardcoded credentials - triggers secret detection (even without extra plugins)
const ADMIN_PASSWORD = "admin123!";
const API_KEY = "sk-live-1234567890abcdef1234567890abcdef";
const AWS_SECRET = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
const DB_PASSWORD = "P@ssw0rd2025!XX";

// Insecure random for "security" decision - triggers S2245
function getAdminAccess() {
    return Math.random() > 0.5; // Using weak RNG for access control - critical!
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const error = document.getElementById('error');

    // Client-side password check - security anti-pattern
    if (username === "admin" && password === ADMIN_PASSWORD) {
        error.style.color = "lime";
        error.textContent = "Acceso concedido (totalmente seguro en cliente!)";
    } else {
        error.textContent = "Acceso denegado.";
        return;
    }

    try {
        // Insecure protocol - triggers hotspot
        await fetch('http://insecure-api.example.com/ping');

        // Insecure WebSocket
        const ws = new WebSocket('ws://evil-server.com/socket');

        // Load users from public JSON (already bad, but let's make it worse)
        const usersResp = await fetch('users.json');
        const users = await usersResp.json();

        // Load jokes
        const jokesResp = await fetch('jokes.json');
        const jokes = await jokesResp.json();

        // ReDoS vulnerable regex - triggers security hotspot
        const redos = /^(a+)+$/;
        const evilInput = "a".repeat(100000) + "b";
        if (redos.test(evilInput)) { // This will hang the browser
            console.log("Regex passed (but froze your tab)");
        }

        // Use of eval - direct security hotspot
        eval("console.log('eval executed - code injection possible')");

        // setTimeout with string - code injection risk
        setTimeout("alert('Executed from string!')", 1000);

        // Weak cryptography - MD5
        const hash = CryptoJS.MD5(password).toString();
        console.log("Password hashed with MD5 (insecure): " + hash);

        // Cookie without Secure/HttpOnly/SameSite - hotspot
        document.cookie = "sessionid=abc123; path=/";
        document.cookie = "auth_token=supersecret; expires=Fri, 31 Dec 9999 23:59:59 GMT";

        // Potential XSS via innerHTML with unescaped data
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        document.getElementById('joke').innerHTML = 
            `<marquee><h2>Chiste del día:</h2><p>${randomJoke}</p></marquee>
             <img src="x" onerror="alert('XSS via joke')">
             <script>alert('Inline script from joke')</script>`;

        // Show joke
        document.getElementById('joke').classList.remove('hidden');
        document.getElementById('login').classList.add('hidden');

        // Bonus: disable XSS protection (if header existed)
        // Not possible in JS, but some scanners flag attempts
        try {
            document.querySelector('meta[http-equiv="X-XSS-Protection"]')?.remove();
        } catch(e) {}

    } catch (err) {
        error.textContent = "Error crítico del sistema (pero todo está bien)";
        console.error(err);
    }
}

// Bonus: function that accepts user input and executes it
function runUserCode() {
    const code = prompt("Ingresa código JavaScript a ejecutar:");
    if (code) {
        // Ultimate red flag
        new Function(code)();
        // Or: eval(code);
    }
}