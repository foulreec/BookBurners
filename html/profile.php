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
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
    <header>
        <nav>
            <h1>BookBurners</h1>
            <ul>
                <li><a href="../index.php">Home</a></li>
                <li><a href="/html/clubs.html">Clubs</a></li>
                
            </ul>
        </nav>
    </header>

    <main>
        <h2>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?></h2>
        <p>Email: <?php echo htmlspecialchars($_SESSION['email']); ?></p>
        <div class="profile-upload">
            <h3>Your Profile Picture</h3>
            <?php
                $uid = intval($_SESSION['user_id']);
                $jpg = __DIR__ . "/../images/profiles/{$uid}.jpg";
                $png = __DIR__ . "/../images/profiles/{$uid}.png";
                $current = '/images/profile_placeholder.png';
                if (file_exists($jpg)) {
                    $current = "/images/profiles/{$uid}.jpg";
                } elseif (file_exists($png)) {
                    $current = "/images/profiles/{$uid}.png";
                }
            ?>
            <img id="profilePreview" src="<?php echo $current; ?>" alt="profile" style="max-width:80px !important;height:auto;display:block;margin-bottom:10px;border-radius:50%;" />

            <form id="profileForm" enctype="multipart/form-data">
                <input type="file" id="profile_pic" name="profile_pic" accept="image/png, image/jpeg" required />
                <br />
                <button type="submit">Upload</button>
                <p id="uploadStatus"></p>
            </form>
        </div>
    </main>

    <footer>
        <p>&copy; 2025 BookBurners</p>
    </footer>
    <script src="../js/profile.js"></script>
    
</body>
</html>