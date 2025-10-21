// main.js
// Replace with your real Google Books API key (or load from config.js)

document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const queryInput = document.getElementById("query");
  const resultsDiv = document.getElementById("results");

  // 🧩 Safety check: if this page doesn’t have the search UI, stop here
  if (!searchBtn || !queryInput || !resultsDiv) {
    console.warn("Search UI not found — skipping searchBooks setup.");
    return;
  }

  // Add listener only if elements exist
  searchBtn.addEventListener("click", searchBooks);
});

function searchBooks() {
  const query = document.getElementById("query").value;
  if (!query) {
    alert("Please enter a search term!");
    return;
  }

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}&key=AIzaSyBETZPZhtou-38NyXidhjkrGIZHe9ytHNM`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = ""; // clear old results

      if (data.items) {
        data.items.forEach((item) => {
          const title = item.volumeInfo.title || "No title";
          const authors = item.volumeInfo.authors
            ? item.volumeInfo.authors.join(", ")
            : "Unknown author";
          const thumbnail = item.volumeInfo.imageLinks
            ? item.volumeInfo.imageLinks.thumbnail
            : "";

          const bookDiv = document.createElement("div");
          bookDiv.className = "book";
          bookDiv.innerHTML = `
            ${thumbnail ? `<img src="${thumbnail}" alt="${title}">` : ""}
            <div>
              <h3>${title}</h3>
              <p><strong>Author(s):</strong> ${authors}</p>
            </div>
          `;
          resultsDiv.appendChild(bookDiv);
        });
      } else {
        resultsDiv.innerHTML = "<p>No results found.</p>";
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}
