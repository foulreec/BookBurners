document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('login-btn');
    const welcomeMessage = document.getElementById('welcome-message');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (loginForm) {
        loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const formData = new FormData(loginForm);

        try {
            const response = await fetch('/php/login.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.text();
            console.log('Server response:', result);

        // if (emailInput.value.trim() === '' || passwordInput.value.trim() === '') {
        //     alert('Please fill in all fields.');
        //     return;
        // }

        if(result.toLowerCase().includes("login successful")) {
            welcomeMessage.textContent = `Welcome back!`;

            setTimeout(() => {
                window.location.replace('/index.html');
                }, 2000);
        }
        else {
            welcomeMessage.textContent = result;
        }
        } catch (error) {
            console.error('Error during login:', error);
            welcomeMessage.textContent = 'An error occurred. Please try again later.';
        }
    });
    }
});