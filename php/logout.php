<?php 
session_start();
session_unset();
session_destroy();

//Delete the cookie if logged out the session
setcookie("remember_user", "", time() - 3600, "/");

header("Location: /index.php");
exit;
?>