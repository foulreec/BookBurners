<?php
session_start();
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$user_id = intval($_SESSION['user_id']);

// Create table if it doesn't exist
$createTable = "CREATE TABLE IF NOT EXISTS reading_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    volume_id VARCHAR(255) NOT NULL,
    title VARCHAR(500),
    authors TEXT,
    thumbnail VARCHAR(1000),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_book (user_id, volume_id)
)";
$conn->query($createTable);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Get user's reading list
    $stmt = $conn->prepare("SELECT volume_id, title, authors, thumbnail, added_at FROM reading_list WHERE user_id = ? ORDER BY added_at DESC");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $books = [];
    while ($row = $result->fetch_assoc()) {
        $books[] = $row;
    }
    
    echo json_encode($books);
    $stmt->close();
    
} elseif ($method === 'POST') {
    // Add book to reading list
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['volumeId'])) {
        http_response_code(400);
        echo json_encode(['error' => 'volumeId required']);
        exit;
    }
    
    $volume_id = $input['volumeId'];
    $title = $input['title'] ?? '';
    $authors = $input['authors'] ?? '';
    $thumbnail = $input['thumbnail'] ?? '';
    
    $stmt = $conn->prepare("INSERT INTO reading_list (user_id, volume_id, title, authors, thumbnail) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), authors = VALUES(authors), thumbnail = VALUES(thumbnail)");
    $stmt->bind_param("issss", $user_id, $volume_id, $title, $authors, $thumbnail);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Book added to your list']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to add book']);
    }
    $stmt->close();
    
} elseif ($method === 'DELETE') {
    // Remove book from reading list
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['volumeId'])) {
        http_response_code(400);
        echo json_encode(['error' => 'volumeId required']);
        exit;
    }
    
    $volume_id = $input['volumeId'];
    
    $stmt = $conn->prepare("DELETE FROM reading_list WHERE user_id = ? AND volume_id = ?");
    $stmt->bind_param("is", $user_id, $volume_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Book removed from your list']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to remove book']);
    }
    $stmt->close();
    
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

$conn->close();
?>
