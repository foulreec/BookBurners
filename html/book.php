<?php 
require_once '../php/config.php';
$apikey = getenv('API_KEY');
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Book Details</title>
    <link rel="stylesheet" href="../css/styles.css" />
  </head>
  <body>
    <header>
      <nav>
        <h1>BookBurners</h1>
        <ul>
          <li><a href="../index.php">Home</a></li>
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
    </main>

    <footer>
      <p>&copy; 2025 BookBurners</p>
    </footer>

     <script>
        // PHP to inject API key into JavaScript
        const apiKey = "<?php echo htmlspecialchars($api_key, ENT_QUOTES); ?>";
        console.log("API key in JS:", apiKey);
    </script>
    <script src="../js/book.js"></script>
  </body>
</html>
