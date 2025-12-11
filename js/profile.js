document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('profileForm');
  const input = document.getElementById('profile_pic');
  const preview = document.getElementById('profilePreview');
  const status = document.getElementById('uploadStatus');

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Uploading...';

    const fd = new FormData(form);

    try {
      const res = await fetch('/BookBurners/php/upload_profile_pic.php', {
        method: 'POST',
        body: fd
      });
      const text = await res.text();
      console.log('Raw response:', text);
      const data = JSON.parse(text);
      console.log('Upload response:', data);
      if (data.success) {
        status.textContent = 'Upload successful.';
        // update preview already set by input change; update header image if present
        const headerImg = document.querySelector('img.profile-icon');
        if (headerImg) headerImg.src = data.path + '?v=' + Date.now();
      } else {
        status.textContent = data.error || 'Upload failed';
      }
    } catch (err) {
      console.error('Upload error:', err);
      status.textContent = 'Error uploading file: ' + err.message;
    }
  });
});
