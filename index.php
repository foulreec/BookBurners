<?php
session_start();
$logged_in = isset($_SESSION['user_id']);

if(isset($_SESSION['user_id']) && isset($_COOKIE['remember_user'])){
  $_SESSION['user_id'] = $_COOKIE['remember_user'];
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BookBurners - Book Club Community</title>
  <link rel="stylesheet" href="css/styles.css" />
</head>

<body>
  <header>
    <nav>
      <div class="nav-left">
        <h1>
          BookBurners
          <?php if ($logged_in): ?>
            <?php
              // Prefer avatar path from session (stored on login/upload), fall back to file checks, then placeholder
              $profile_path = 'images/profile_placeholder.png';
              if (!empty($_SESSION['profile_pic'])) {
                  $profile_path = $_SESSION['profile_pic'];
              } elseif (isset($_SESSION['user_id'])) {
                $uid = intval($_SESSION['user_id']);
                $jpg = __DIR__ . "/images/profiles/{$uid}.jpg";
                $png = __DIR__ . "/images/profiles/{$uid}.png";
                if (file_exists($jpg)) {
                  $profile_path = "images/profiles/{$uid}.jpg";
                } elseif (file_exists($png)) {
                  $profile_path = "images/profiles/{$uid}.png";
                }
              }
            ?>
            <a href="html/profile.php" id="login-btn">
              <img src="<?php echo $profile_path; ?>" alt="profile-icon" class="profile-icon-h1">
            </a>
          <?php else: ?>
            <a href="html/login.html" id="login-btn">
              <img src="images/profile_placeholder.png" alt="login-icon" class="profile-icon-h1">
            </a>
          <?php endif; ?>
        </h1>
      </div>
      <ul>
        <li><a href="html/books.php">Search for Books</a></li>
        <li><a href="html/clubs.html">Clubs</a></li>
        <?php if ($logged_in): ?>
          <li><a href="html/my_list.php">My Reading List</a></li>
        <?php endif; ?>
        <!-- <li><a href="#discussions">Discussions</a></li>
        <li><a href="#members">Members</a></li> -->

        <?php if($logged_in): ?>
          <li><button id="registration-btn" style="display: none;">Sign Up</button></li>
        <?php else: ?>
          <li><button id="registration-btn">Sign Up</button></li>
        <?php endif; ?>

        <?php if ($logged_in): ?>
          <li><a href="php/logout.php">Logout</a></li>
        <?php endif; ?>
      </ul>

    </nav>
  </header>

  <main>
    <!-- Home Section -->
    <section id="home">
      <h2>Welcome to BookBurners</h2>

      <div class="intro-paragraph">
        <p>
          A community for book lovers to share, discuss, and explore new
          reads. This website is welcome to avid book readers as well as those
          looking to dive into the world of literature. Join us to ignite your
          passion for books!
        </p>
        <p>
          Explore our curated book lists, participate in lively discussions,
          and connect with fellow book enthusiasts. Whether you're into
          fiction, non-fiction, fantasy, or mystery, there's something for
          everyone at BookBurners.
        </p>
      </div>
    </section>

    <section id="clubs">
      <h2>Join a Club</h2>
      <p>
        Interested in joining a club? Connect with fellow book enthusiasts by
        joining one of our many book clubs. Share your thoughts, participate
        in discussions, and enjoy reading together.
      </p>

      <button id="club-btn">Learn More</button>
    </section>
  </main>

  <footer>
    <p id="footer-id">&copy; 2025 BookBurners</p>
  </footer>

  <!-- External JS -->
  <script src="js/homepage.js"></script>
  <script src="js/main.js"></script>
  <script src="js/discussions.js"></script>
</body>

</html>