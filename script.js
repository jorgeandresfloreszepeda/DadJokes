async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const error = document.getElementById('error');

    if (!username || !password) {
        error.textContent = 'Por favor, ingresa usuario y contraseña.';
        return;
    }

    try {
        // Cargar usuarios desde users.json
        const usersResponse = await fetch('users.json');
        const users = await usersResponse.json();

        // Validar credenciales
        const validUser = users.find(user => user.username === username && user.password === password);
        if (!validUser) {
            error.textContent = 'Usuario o contraseña incorrectos.';
            return;
        }

        // Si es válido, cargar chistes desde jokes.json
        const jokesResponse = await fetch('jokes.json');
        const jokes = await jokesResponse.json();

        // Seleccionar un chiste aleatorio
        const randomIndex = Math.floor(Math.random() * jokes.length);
        const randomJoke = jokes[randomIndex];

        // Mostrar el chiste y ocultar el login
        document.getElementById('joke').textContent = randomJoke;
        document.getElementById('joke').classList.remove('hidden');
        document.getElementById('login').classList.add('hidden');
    } catch (err) {
        error.textContent = 'Error al cargar los datos. Verifica los archivos JSON.';
        console.error(err);
    }
}