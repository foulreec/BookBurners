<?php
require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$api_key = $_ENV['API_KEY'] ?? NULL;

if (!$api_key) {
    die("API key not found in environment!");
}

$servername = $_ENV['DB_HOST'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];
$db_name = $_ENV['DB_NAME'];

//Create connection
$conn = new mysqli(($servername), ($username), ($password), ($db_name));

//Check connection
// if($conn->connect_error){
//     die("Connection failed: " . $conn->connect_error);
// }
// else
// {
//     echo "Connected successfully";
// }
 ?>