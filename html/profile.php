<?php 
session_start();
if(!isset($_SESSION['user_id'])){
    header("Location: /html/login.html");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile Page</title>
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
    <header>
        <nav>
            <h1>BookBurners</h1>
            <ul>
                <li><a href="/index.php">Home</a></li>
                <li><a href="/html/clubs.html">Clubs</a></li>
                <li><a href="#discussions">Discussions</a></li>
                <li><a href="#members">Members</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <h2>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?></h2>
        <p>Email: <?php echo htmlspecialchars($_SESSION['email']); ?></p>
    </main>

    <footer>
        <p>&copy; 2025 BookBurners</p>
    </footer>
    
</body>
</html>