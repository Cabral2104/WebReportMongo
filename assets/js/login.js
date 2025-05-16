document.addEventListener("DOMContentLoaded", function () {
    // Obtener los elementos del DOM
    const togglePassword = document.getElementById("togglePassword");
    const passwordField = document.getElementById("password");
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.querySelector('.login-btn');

    // Verificar si el botón y el campo de contraseña existen en el DOM
    if (togglePassword && passwordField) {
        // Agregar un event listener al botón para mostrar/ocultar la contraseña
        togglePassword.addEventListener("click", function () {
            // Alternar entre tipo 'password' y 'text' para mostrar/ocultar la contraseña
            const type = passwordField.type === "password" ? "text" : "password";
            passwordField.type = type;

            // Cambiar el icono del ojo
            const icon = togglePassword.querySelector("i");
            if (passwordField.type === "password") {
                icon.classList.remove("bi-eye-slash");
                icon.classList.add("bi-eye");
            } else {
                icon.classList.remove("bi-eye");
                icon.classList.add("bi-eye-slash");
            }
        });
    }

    // Función para manejar el submit del formulario de login
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevenir el comportamiento por defecto (recarga de página)

        // Obtener los valores de los campos
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validación simple (puedes mejorarla)
        if (!email || !password) {
            alert('Por favor, ingresa tu correo y contraseña.');
            return;
        }

        // Enviar los datos al backend (usando fetch)
        fetch('/auth/login', {  // Actualiza la URL a '/auth/login'
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo: email, contraseña: password }), // Convertir los datos en formato JSON
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Si el login fue exitoso, redirige al usuario a la página del dashboard
                localStorage.setItem('usuario', JSON.stringify(data.usuario)); // Guarda el usuario en localStorage
                window.location.href = '../index.html';  // Cambia '/dashboard' por la ruta adecuada a tu aplicación
            } else {
                // Si hay un error, muestra el mensaje
                alert(data.error || 'Hubo un error en el inicio de sesión');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al conectar con el servidor.');
        });
    });

    console.log("El script de login está funcionando correctamente");
});
