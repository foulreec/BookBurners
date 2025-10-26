document.addEventListener("DOMContentLoaded", () => {
    const bookCards = document.getElementsByClassName("genre-container");
    Array.from(bookCards).forEach(card => {
        card.addEventListener("click", () => {
            const genre = card.getAttribute("genre-card");
            window.location.href = `html/books.php?genre=${encodeURIComponent(genre)}`;
        });
    });

    const clubBtn = document.getElementById("club-btn");
    if (clubBtn) {
        clubBtn.addEventListener("click", () => {
            window.location.href = 'html/clubs.html';
        });
    }

    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            window.location.href = 'html/register.html';
        });
    }
});