// js/discussions.js
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const volumeId = params.get('id');
  const listContainer = document.getElementById('discussions-list');
  const form = document.getElementById('discussion-form');

  if (!volumeId) {
    if (listContainer) listContainer.innerHTML = '<p>No volume id provided.</p>';
    return;
  }

  function renderItem(item) {
    const el = document.createElement('div');
    el.className = 'discussion-item';
    const head = document.createElement('div');
    head.className = 'discussion-head';
    const title = document.createElement('strong');
    title.textContent = item.title || '(no title)';
    const meta = document.createElement('span');
    meta.className = 'discussion-meta';
    meta.textContent = (item.author ? ' by ' + item.author : '') + ' — ' + item.created_at;
    head.appendChild(title);
    head.appendChild(meta);
    const body = document.createElement('div');
    body.className = 'discussion-body';
    body.textContent = item.content;
    el.appendChild(head);
    el.appendChild(body);
    return el;
  }

  function loadDiscussions() {
    fetch(`/php/api/discussions.php?volumeId=${encodeURIComponent(volumeId)}`)
      .then(r => r.json())
      .then(data => {
        listContainer.innerHTML = '';
        if (!Array.isArray(data) || data.length === 0) {
          listContainer.innerHTML = '<p>No discussions yet. Start the first!</p>';
          return;
        }
        data.forEach(d => listContainer.appendChild(renderItem(d)));
      })
      .catch(err => {
        console.error('Failed to load discussions', err);
        listContainer.innerHTML = '<p>Failed to load discussions.</p>';
      });
  }

  if (form) {
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
      fetch('/php/api/discussions.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(r => r.json())
      .then(created => {
        // prepend new item
        const node = renderItem(created);
        listContainer.insertBefore(node, listContainer.firstChild);
        form.reset();
      })
      .catch(err => {
        console.error('Failed to post discussion', err);
        alert('Failed to post discussion.');
      });
    });
  }

  // initial load
  if (listContainer) loadDiscussions();
});
