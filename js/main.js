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
          // Use safe values and create elements rather than interpolating raw HTML
          const title = item.volumeInfo.title || "No title";
          const authors = item.volumeInfo.authors
            ? item.volumeInfo.authors.join(", ")
            : "Unknown author";
          const thumbnail = item.volumeInfo.imageLinks
            ? item.volumeInfo.imageLinks.thumbnail
            : "";

          const link = document.createElement('a');
          // Link to the book details page with the volume id.
          // If the current page is already inside the `html/` folder (e.g. html/books.html),
          // use a relative path `book.html`. Otherwise use `html/book.html`.
          const currentPath = window.location.pathname || '';
          const inHtmlFolder = currentPath.includes('/html/');
          link.href = inHtmlFolder
            ? `book.html?id=${encodeURIComponent(item.id)}`
            : `html/book.html?id=${encodeURIComponent(item.id)}`;
          link.className = 'book-link';
          link.rel = 'noopener';

          const bookDiv = document.createElement('div');
          bookDiv.className = 'book';

          if (thumbnail) {
            const img = document.createElement('img');
            img.src = thumbnail;
            img.alt = title;
            bookDiv.appendChild(img);
          }

          const meta = document.createElement('div');
          const h3 = document.createElement('h3');
          h3.textContent = title;
          const p = document.createElement('p');
          const strong = document.createElement('strong');
          strong.textContent = 'Author(s): ';
          p.appendChild(strong);
          p.appendChild(document.createTextNode(authors));

          meta.appendChild(h3);
          meta.appendChild(p);
          bookDiv.appendChild(meta);

          link.appendChild(bookDiv);
          resultsDiv.appendChild(link);
        });
      } else {
        resultsDiv.innerHTML = "<p>No results found.</p>";
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}
