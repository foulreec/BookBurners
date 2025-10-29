<?php
require_once __DIR__ . '/config.php';

$conn = new mysqli($servername, $username, $password, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//Handle registration form submission
if($_SERVER["REQUEST_METHOD"] == "POST")
{
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['user_password'], PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO users (username, email, user_password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $password);

    if($stmt->execute()){
        echo "Registration successful!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>