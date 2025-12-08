<?php
session_start();

require_once __DIR__ . '/config.php';

$conn = new mysqli($servername, $username, $password, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}



//Handle login form submission
if($_SERVER["REQUEST_METHOD"] == "POST")
{
    $email = $_POST['email'];
    $username = $_POST['username'];
    $password = $_POST['user_password'];

    $stmt = $conn->prepare("SELECT user_id, username, user_password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if($stmt->num_rows == 1){
        $stmt->bind_result($db_user_id, $username, $hashed_password);
        $stmt->fetch();

        if($db_user_id && $username && password_verify($password, $hashed_password)){

            $_SESSION['user_id'] = $db_user_id;
            $_SESSION['username'] = $username;
            $_SESSION['email'] = $email;

            echo "Login successful";
        } else {
            echo "Invalid password";
        }
    } else {
        echo "No user found with that email.";
    }

    $stmt->close();
    $conn->close();
}
?>