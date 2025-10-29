document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault(); //Prevent page reload

            if (usernameInput.value.trim() === "" || emailInput.value.trim() === "" || passwordInput.value.trim() === "" || confirmPasswordInput.value.trim() === "") {
                alert("Please fill in all fields.");
                return;
            }

            if (passwordInput.value !== confirmPasswordInput.value) {
                alert("Passwords do not match.");
                return;
            }

            const formData = new FormData(e.target);
            const response = await fetch('/php/register.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.text();

            console.log(result);
            const responseMessage = document.getElementById("response-message");
            if (responseMessage) {
                responseMessage.textContent = result;
            }
        });
    }
});