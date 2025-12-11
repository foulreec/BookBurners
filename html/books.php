<?php
session_start();
require_once '../php/config.php';
$apikey = getenv('API_KEY');
$logged_in = isset($_SESSION['user_id']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Books</title>
    <link rel="stylesheet" href="../css/books.css">
</head>
<body>
    <header>
        <nav>
            <h1>BookBurners</h1>
            <ul>
                <li><a href="../index.php">Home</a></li>
                <li><a href="../html/clubs.html">Clubs</a></li>
                <?php if ($logged_in): ?>
                    <li><a href="my_list.php">My Reading List</a></li>
                <?php endif; ?>
                <!-- <li><a href="#discussions">Discussions</a></li>
                <li><a href="#members">Members</a></li> -->
            </ul>
        </nav>
    </header>

    <main>
        <section id="search-books">
            <h2>Search Books</h2>
            <input type="text" id="query" placeholder="Search for books...">
            <button id="searchBtn">Search</button>

            <div id="results">
                <!-- Book results will be displayed here to allow for button functionality -->
            </div>
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
    <!-- External JS -->
    <script src="../js/main.js"></script>
</body>
</html>