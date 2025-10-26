document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault(); //Prevent page reload

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