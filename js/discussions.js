/**
 * discussions.js - Discussion System Controller
 * 
 * Manages discussion functionality across multiple contexts:
 * 1. Book-specific discussions (on book.php pages)
 * 2. Genre-based discussions (on index.php homepage)
 * 3. Threaded replies (nested comment system)
 * 
 * Features:
 * - Create new discussions with author, title, and content
 * - Reply to existing discussions (nested/threaded)
 * - Load and display discussions from database
 * - Modal interface for genre discussions
 * - Login state checking for posting permissions
 * 
 * Backend API: ../php/api/discussions.php (GET, POST)
 */

// Initialize discussion system when page loads
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const volumeId = params.get('id');
  const listContainer = document.getElementById('discussions-list');
  const form = document.getElementById('discussion-form');

  // Genre discussion functionality for index.php
  const genreCards = document.querySelectorAll('.genre-card[data-genre]');
  if (genreCards.length > 0) {
    initGenreDiscussions(genreCards);
  }

  // Book discussion page functionality
  if (volumeId && listContainer) {
    initBookDiscussions(volumeId, listContainer, form);
  }
});

/**
 * Initialize genre discussion cards on homepage
 * Makes genre cards clickable to open discussion modals
 * 
 * @param {NodeList} genreCards - Collection of genre card elements
 */
function initGenreDiscussions(genreCards) {
  genreCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const genre = card.getAttribute('data-genre');
      showGenreDiscussion(genre, card.querySelector('h3').textContent);
    });
  });
}

/**
 * Display genre discussion modal
 * Creates a modal overlay with discussion list and posting form
 * 
 * @param {string} genre - Genre identifier (e.g., 'fiction', 'fantasy')
 * @param {string} genreTitle - Display name for the genre
 */
function showGenreDiscussion(genre, genreTitle) {
  // Create modal overlay (darkened background)
  const overlay = document.createElement('div');
  overlay.className = 'discussion-modal-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:1000;display:flex;align-items:center;justify-content:center;';
  
  // Create modal content container
  const modal = document.createElement('div');
  modal.className = 'discussion-modal';
  modal.style.cssText = 'background:white;padding:2rem;border-radius:8px;max-width:700px;width:90%;max-height:80vh;overflow-y:auto;position:relative;';
  
  // Add close button (X)
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = 'position:absolute;top:10px;right:15px;border:none;background:none;font-size:2rem;cursor:pointer;color:#333;';
  closeBtn.onclick = () => overlay.remove();
  
  const title = document.createElement('h2');
  title.textContent = `${genreTitle} Discussions`;
  title.style.marginBottom = '1rem';
  
  const listContainer = document.createElement('div');
  listContainer.id = 'genre-discussions-list';
  listContainer.style.marginBottom = '1.5rem';
  
  const formTitle = document.createElement('h3');
  formTitle.textContent = 'Start a Discussion';
  formTitle.style.marginBottom = '0.5rem';
  
  const form = document.createElement('form');
  form.id = 'genre-discussion-form';
  form.innerHTML = `
    <input type="text" name="author" placeholder="Your name (optional)" style="width:100%;padding:0.5rem;margin-bottom:0.5rem;border:1px solid #ccc;border-radius:4px;" />
    <input type="text" name="title" placeholder="Discussion title" style="width:100%;padding:0.5rem;margin-bottom:0.5rem;border:1px solid #ccc;border-radius:4px;" required />
    <textarea name="content" placeholder="Share your thoughts..." rows="4" style="width:100%;padding:0.5rem;margin-bottom:0.5rem;border:1px solid #ccc;border-radius:4px;" required></textarea>
    <button type="submit" style="padding:0.5rem 1rem;background:#333;color:white;border:none;border-radius:4px;cursor:pointer;">Post</button>
  `;
  
  // Assemble modal content
  modal.appendChild(closeBtn);
  modal.appendChild(title);
  modal.appendChild(listContainer);
  modal.appendChild(formTitle);
  modal.appendChild(form);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Load discussions for this genre
  loadGenreDiscussions(genre, listContainer);
  
  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const payload = {
      volumeId: `genre-${genre}`,
      author: formData.get('author') || 'Anonymous',
      title: formData.get('title') || '',
      content: formData.get('content') || ''
    };
    
    if (!payload.content.trim()) {
      alert('Please write a message for the discussion.');
      return;
    }
    
    // Determine correct API path based on current location
    const apiPath = window.location.pathname.includes('/html/') ? '../php/api/discussions.php' : 'php/api/discussions.php';
    
    fetch(apiPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(created => {
      const node = renderDiscussionItem(created);
      listContainer.insertBefore(node, listContainer.firstChild);
      form.reset();
    })
    .catch(err => {
      console.error('Failed to post discussion', err);
      alert('Failed to post discussion.');
    });
  });
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

/**
 * Load and display discussions for a specific genre
 * Fetches from API and renders each discussion
 * 
 * @param {string} genre - Genre identifier
 * @param {HTMLElement} container - Element to render discussions into
 */
function loadGenreDiscussions(genre, container) {
  container.innerHTML = '<p>Loading discussions...</p>';
  
  // Determine correct API path based on current location
  const apiPath = window.location.pathname.includes('/html/') ? '../php/api/discussions.php' : 'php/api/discussions.php';
  
  fetch(`${apiPath}?volumeId=${encodeURIComponent('genre-' + genre)}`)
    .then(r => r.json())
    .then(data => {
      container.innerHTML = '';
      if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<p style="color:#666;font-style:italic;">No discussions yet. Start the first one!</p>';
        return;
      }
      data.forEach(d => container.appendChild(renderDiscussionItem(d)));
    })
    .catch(err => {
      console.error('Failed to load discussions', err);
      container.innerHTML = '<p style="color:red;">Failed to load discussions.</p>';
    });
}

/**
 * Initialize book-specific discussion functionality
 * Sets up discussion loading and form handling for individual book pages
 * 
 * @param {string} volumeId - Google Books volume ID
 * @param {HTMLElement} listContainer - Element to display discussions
 * @param {HTMLFormElement} form - Discussion posting form
 */
function initBookDiscussions(volumeId, listContainer, form) {
  // Validate that volumeId is present
  if (!volumeId) {
    if (listContainer) listContainer.innerHTML = '<p>No volume id provided.</p>';
    return;
  }

  // Check if user is logged in (set by book.php via window.isLoggedIn)
  const isLoggedIn = window.isLoggedIn || false;

  /**
   * Load discussions for current book from API
   */
  function loadDiscussions() {
    fetch(`../php/api/discussions.php?volumeId=${encodeURIComponent(volumeId)}`)
      .then(r => r.json())
      .then(data => {
        listContainer.innerHTML = '';
        if (!Array.isArray(data) || data.length === 0) {
          listContainer.innerHTML = '<p>No discussions yet. Start the first!</p>';
          return;
        }
        data.forEach(d => listContainer.appendChild(renderDiscussionItem(d)));
      })
      .catch(err => {
        console.error('Failed to load discussions', err);
        listContainer.innerHTML = '<p>Failed to load discussions.</p>';
      });
  }

  if (form) {
    // Replace form with login prompt if user is not logged in
    if (!isLoggedIn) {
      form.innerHTML = '<p style="color:#666;padding:1rem;background:#f5f5f5;border-radius:4px;">Please <a href="../html/login.html" style="color:#333;text-decoration:underline;">sign in</a> to join the discussion.</p>';
    } else {
      // Set up form submission for logged-in users
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const payload = {
          volumeId: volumeId,
          author: formData.get('author') || '',
          title: formData.get('title') || '',
          content: formData.get('content') || ''
        };
        if (!payload.content.trim()) {
          alert('Please write a message for the discussion.');
          return;
        }
        fetch('../php/api/discussions.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        .then(r => r.json())
        .then(created => {
          const node = renderDiscussionItem(created);
          listContainer.insertBefore(node, listContainer.firstChild);
          form.reset();
        })
        .catch(err => {
          console.error('Failed to post discussion', err);
          alert('Failed to post discussion.');
        });
      });
    }
  }

  loadDiscussions();
}

/**
 * Render a single discussion item as DOM element
 * Includes author, timestamp, content, reply button, and nested replies
 * 
 * @param {Object} item - Discussion data object from API
 * @returns {HTMLElement} Rendered discussion element
 */
function renderDiscussionItem(item) {
  // Create main container for discussion
  const el = document.createElement('div');
  el.className = 'discussion-item';
  el.style.cssText = 'border-bottom:1px solid #eee;padding:1rem 0;';
  el.setAttribute('data-discussion-id', item.id);
  
  const head = document.createElement('div');
  head.className = 'discussion-head';
  head.style.marginBottom = '0.5rem';
  
  const title = document.createElement('strong');
  title.textContent = item.title || '(no title)';
  title.style.fontSize = '1.1rem';
  
  const meta = document.createElement('span');
  meta.className = 'discussion-meta';
  meta.style.cssText = 'color:#666;font-size:0.9rem;margin-left:0.5rem;';
  meta.textContent = (item.author ? ' by ' + item.author : '') + ' — ' + item.created_at;
  
  head.appendChild(title);
  head.appendChild(meta);
  
  const body = document.createElement('div');
  body.className = 'discussion-body';
  body.style.color = '#333';
  body.textContent = item.content;
  
  // Reply button
  const replyBtn = document.createElement('button');
  replyBtn.textContent = 'Reply';
  replyBtn.style.cssText = 'margin-top:0.5rem;padding:0.25rem 0.75rem;background:#555;color:white;border:none;border-radius:3px;cursor:pointer;font-size:0.85rem;';
  replyBtn.onclick = () => showReplyForm(item.id, el);
  
  el.appendChild(head);
  el.appendChild(body);
  el.appendChild(replyBtn);
  
  // Render replies (nested)
  if (item.replies && item.replies.length > 0) {
    const repliesContainer = document.createElement('div');
    repliesContainer.className = 'replies-container';
    repliesContainer.style.cssText = 'margin-left:2rem;margin-top:1rem;border-left:2px solid #ddd;padding-left:1rem;';
    item.replies.forEach(reply => {
      repliesContainer.appendChild(renderDiscussionItem(reply));
    });
    el.appendChild(repliesContainer);
  }
  
  return el;
}

/**
 * Display reply form below a discussion
 * Creates inline form for posting replies to discussions
 * 
 * @param {number} parentId - ID of parent discussion to reply to
 * @param {HTMLElement} parentEl - Parent discussion element to attach form to
 */
function showReplyForm(parentId, parentEl) {
  // Prevent multiple forms from appearing
  if (parentEl.querySelector('.reply-form')) return;
  
  // Create inline reply form
  const form = document.createElement('form');
  form.className = 'reply-form';
  form.style.cssText = 'margin-top:1rem;padding:1rem;background:#f9f9f9;border-radius:4px;';
  form.innerHTML = `
    <input type="text" name="author" placeholder="Your name (optional)" style="width:100%;padding:0.5rem;margin-bottom:0.5rem;border:1px solid #ccc;border-radius:4px;" />
    <textarea name="content" placeholder="Write your reply..." rows="3" style="width:100%;padding:0.5rem;margin-bottom:0.5rem;border:1px solid #ccc;border-radius:4px;" required></textarea>
    <button type="submit" style="padding:0.5rem 1rem;background:#333;color:white;border:none;border-radius:4px;cursor:pointer;margin-right:0.5rem;">Post Reply</button>
    <button type="button" class="cancel-btn" style="padding:0.5rem 1rem;background:#999;color:white;border:none;border-radius:4px;cursor:pointer;">Cancel</button>
  `;
  
  form.querySelector('.cancel-btn').onclick = () => form.remove();
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    // Get volumeId from URL params or from page context
    const params = new URLSearchParams(window.location.search);
    let volumeId = params.get('id');
    
    // If on homepage with genre discussions, get from modal
    if (!volumeId) {
      const modal = document.querySelector('.discussion-modal');
      if (modal) {
        const genreTitle = modal.querySelector('h2').textContent;
        const genre = genreTitle.replace(' Discussions', '').toLowerCase().replace(/\s+/g, '-');
        volumeId = `genre-${genre}`;
      }
    }
    
    const payload = {
      volumeId: volumeId,
      parentId: parentId,
      author: formData.get('author') || 'Anonymous',
      title: '',
      content: formData.get('content') || ''
    };
    
    if (!payload.content.trim()) {
      alert('Please write a reply.');
      return;
    }
    
    const apiPath = window.location.pathname.includes('/html/') ? '../php/api/discussions.php' : 'php/api/discussions.php';
    
    fetch(apiPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(created => {
      // Add reply to the UI
      let repliesContainer = parentEl.querySelector('.replies-container');
      if (!repliesContainer) {
        repliesContainer = document.createElement('div');
        repliesContainer.className = 'replies-container';
        repliesContainer.style.cssText = 'margin-left:2rem;margin-top:1rem;border-left:2px solid #ddd;padding-left:1rem;';
        parentEl.appendChild(repliesContainer);
      }
      repliesContainer.appendChild(renderDiscussionItem(created));
      form.remove();
    })
    .catch(err => {
      console.error('Failed to post reply', err);
      alert('Failed to post reply.');
    });
  });
  
  parentEl.appendChild(form);
}
