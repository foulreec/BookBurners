<?php 
session_start();
session_unset();
session_destroy();

//Delete the cookie if logged out the session
setcookie("remember_user", "", time() - 3600, "/");

// Redirect back to the BookBurners app root (absolute path from web root).
// Using "/index.php" points to the server root (e.g. XAMPP dashboard),
// so send users to the project folder instead.
header("Location: /BookBurners/");
exit;
?>