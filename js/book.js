// book.js
// Reads ?id=VOLUME_ID from the URL and fetches the volume details

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const container = document.getElementById('book-details');

  if (!id) {
    container.innerHTML = '<p>No book id provided in the URL.</p>A';
    return;
  }

  const apiKey = 'AIzaSyBETZPZhtou-38NyXidhjkrGIZHe9ytHNM';
  const url = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}?key=${apiKey}`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => renderBook(data, container))
    .catch(err => {
      console.error('Error fetching book details:', err);
      container.innerHTML = '<p>Failed to load book details. Please try again later.</p>';
    });
});

function renderBook(item, container) {
  if (!item || !item.volumeInfo) {
    container.innerHTML = '<p>No details available for this book.</p>';
    return;
  }

  const info = item.volumeInfo;
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'book-detail';

  if (info.imageLinks && info.imageLinks.thumbnail) {
    const img = document.createElement('img');
    img.src = info.imageLinks.thumbnail;
    img.alt = info.title || 'Book cover';
    wrapper.appendChild(img);
  }

  const meta = document.createElement('div');
  meta.className = 'book-meta';

  const title = document.createElement('h2');
  title.textContent = info.title || 'No title';
  meta.appendChild(title);

  if (info.authors) {
    const authors = document.createElement('p');
    authors.innerHTML = '<strong>Author(s):</strong> ' + info.authors.join(', ');
    meta.appendChild(authors);
  }

  if (info.publishedDate) {
    const pub = document.createElement('p');
    pub.innerHTML = '<strong>Published:</strong> ' + info.publishedDate;
    meta.appendChild(pub);
  }

  if (info.description) {
    const desc = document.createElement('div');
    desc.className = 'book-description';
    desc.innerHTML = info.description; // description may contain HTML
    meta.appendChild(desc);
  }

  if (info.previewLink) {
    const preview = document.createElement('p');
    preview.innerHTML = `<a href="${info.previewLink}" target="_blank" rel="noopener">Open preview on Google Books</a>`;
    meta.appendChild(preview);
  }

  wrapper.appendChild(meta);
  container.appendChild(wrapper);
}
