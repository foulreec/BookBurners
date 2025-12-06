<?php
// Static book details page — data is loaded via client-side requests and server-side proxy endpoints.
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Book Details</title>
    <link rel="stylesheet" href="../css/styles.css" />
    <link rel="stylesheet" href="../css/discussions.css" />
  </head>
  <body>
    <header>
      <nav>
        <h1>BookBurners</h1>
        <ul>
          <li><a href="../index.html">Home</a></li>
          <li><a href="books.php">Books</a></li>
          <li><a href="clubs.html">Clubs</a></li>
          <li><a href="#discussions">Discussions</a></li>
          <li><a href="#members">Members</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <section id="book-details">
        <p id="loading">Loading book details…</p>
      </section>
      <section id="discussions-section">
        <h2>Discussions</h2>
        <div id="discussions-list">Loading discussions…</div>

        <h3>Start a discussion</h3>
        <form id="discussion-form">
          <label>
            Your name (optional)
            <input type="text" name="author" placeholder="e.g. Jamie" />
          </label>
          <label>
            Title (optional)
            <input type="text" name="title" placeholder="Short summary" />
          </label>
          <label>
            Message
            <textarea name="content" required placeholder="Share your thoughts..."></textarea>
          </label>
          <button type="submit">Post discussion</button>
        </form>
      </section>
    </main>

    <footer>
      <p>&copy; 2025 BookBurners</p>
    </footer>

    <script src="../js/book.js"></script>
    <script src="../js/discussions.js"></script>
  </body>
</html>
