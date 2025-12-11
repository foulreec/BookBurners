/**
 * book.js - Book Details Page Controller
 * 
 * Handles the book details page by:
 * 1. Extracting the book ID from URL query parameters (?id=VOLUME_ID)
 * 2. Fetching book information from Google Books API
 * 3. Dynamically rendering book details (cover, title, authors, description, etc.)
 * 4. Managing the "Add to My List" button for logged-in users
 * 
 * Dependencies:
 * - Google Books API (requires valid API key)
 * - Session state (window.isLoggedIn) set by book.php
 * - Backend API endpoint: ../php/api/reading_list.php
 */

// Debug: Verify script loads and session state is available
console.log('book.js loaded');
console.log('window.isLoggedIn:', window.isLoggedIn);

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired');
  
  // Extract book ID from URL query parameter (e.g., book.php?id=abc123)
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const container = document.getElementById('book-details');
  
  console.log('Book ID:', id);
  console.log('Container:', container);

  // Validate that a book ID was provided in the URL
  if (!id) {
    container.innerHTML = '<p>No book id provided in the URL.</p>A';
    return;
  }

  // Construct Google Books API request
  const apiKey = 'AIzaSyBETZPZhtou-38NyXidhjkrGIZHe9ytHNM';
  const url = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}?key=${apiKey}`;

  // Fetch book details from Google Books API
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

/**
 * Renders book details to the page
 * 
 * Creates and appends DOM elements to display:
 * - Book cover image
 * - Title and authors
 * - Publication date
 * - Description (may contain HTML)
 * - Preview link to Google Books
 * - "Add to My List" button (for logged-in users)
 * 
 * @param {Object} item - Book data object from Google Books API
 * @param {HTMLElement} container - DOM element to render book details into
 */
function renderBook(item, container) {
  console.log('renderBook called');
  console.log('isLoggedIn:', window.isLoggedIn);
  
  if (!item || !item.volumeInfo) {
    container.innerHTML = '<p>No details available for this book.</p>';
    return;
  }

  const info = item.volumeInfo;
  container.innerHTML = ''; // Clear loading message

  // Create wrapper div for book details
  const wrapper = document.createElement('div');
  wrapper.className = 'book-detail';

  // Add book cover image if available
  if (info.imageLinks && info.imageLinks.thumbnail) {
    const img = document.createElement('img');
    img.src = info.imageLinks.thumbnail;
    img.alt = info.title || 'Book cover';
    wrapper.appendChild(img);
  }

  // Create container for book metadata
  const meta = document.createElement('div');
  meta.className = 'book-meta';

  // Add book title
  const title = document.createElement('h2');
  title.textContent = info.title || 'No title';
  meta.appendChild(title);

  // Add authors if available
  if (info.authors) {
    const authors = document.createElement('p');
    authors.innerHTML = '<strong>Author(s):</strong> ' + info.authors.join(', ');
    meta.appendChild(authors);
  }

  // Add publication date if available
  if (info.publishedDate) {
    const pub = document.createElement('p');
    pub.innerHTML = '<strong>Published:</strong> ' + info.publishedDate;
    meta.appendChild(pub);
  }

  // Add book description if available
  if (info.description) {
    const desc = document.createElement('div');
    desc.className = 'book-description';
    desc.innerHTML = info.description; // Description may contain HTML formatting
    meta.appendChild(desc);
  }

  // Add Google Books preview link if available
  if (info.previewLink) {
    const preview = document.createElement('p');
    preview.innerHTML = `<a href="${info.previewLink}" target="_blank" rel="noopener">Open preview on Google Books</a>`;
    meta.appendChild(preview);
  }

  /**
   * Reading List Button Handler
   * 
   * Connects to the "Add to My List" button in the header (book.php).
   * Only executes if user is logged in (window.isLoggedIn = true).
   * 
   * Functionality:
   * - Sends book data to backend API for storage
   * - Updates button text and style on success
   * - Disables button to prevent duplicate additions
   * - Shows error alerts if save fails
   */
  if (window.isLoggedIn) {
    const addBtn = document.getElementById('add-to-list-btn');
    console.log('Button found:', addBtn);
    console.log('Book item:', item);
    
    if (addBtn) {
      // Clone button to remove any existing event listeners (prevents multiple bindings)
      const newBtn = addBtn.cloneNode(true);
      addBtn.parentNode.replaceChild(newBtn, addBtn);
      
      newBtn.addEventListener('click', () => {
        console.log('Button clicked!');
        
        // Determine correct API path based on current page location
        const apiPath = window.location.pathname.includes('/html/') ? '../php/api/reading_list.php' : 'php/api/reading_list.php';
        
        // Prepare book data for storage
        const bookData = {
          volumeId: item.id,
          title: info.title || '',
          authors: info.authors ? info.authors.join(', ') : '',
          thumbnail: info.imageLinks?.thumbnail || ''
        };
        
        console.log('Sending book data:', bookData);
        console.log('API path:', apiPath);
        
        // Send POST request to add book to user's reading list
        fetch(apiPath, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData)
        })
        .then(r => {
          console.log('Response status:', r.status);
          return r.json();
        })
        .then(data => {
          console.log('Response data:', data);
          
          // Handle successful addition
          if (data.success) {
            newBtn.textContent = '✓ Added to List';
            newBtn.style.background = '#28a745'; // Green background
            newBtn.disabled = true; // Prevent duplicate additions
          } else {
            // Show error message from API
            alert('Failed to add book to your list: ' + (data.error || 'Unknown error'));
          }
        })
        .catch(err => {
          // Handle network or parsing errors
          console.error('Error adding book:', err);
          alert('Failed to add book to your list: ' + err.message);
        });
      });
    } else {
      console.error('Button not found in DOM');
    }
  }

  // Assemble and append all elements to the page
  wrapper.appendChild(meta);
  container.appendChild(wrapper);
}
