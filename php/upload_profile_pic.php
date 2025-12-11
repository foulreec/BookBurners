<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

session_start();

header('Content-Type: application/json');

// Check authentication
if(!isset($_SESSION['user_id'])){
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$user_id = intval($_SESSION['user_id']);

require_once __DIR__ . '/config.php';

if(!isset($_SESSION['user_id'])){
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$user_id = intval($_SESSION['user_id']);
// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}
// Check if file uploaded
if (!isset($_FILES['profile_pic']) || $_FILES['profile_pic']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded or upload error']);
    exit;
}

$file = $_FILES['profile_pic'];

// Validate file size (limit to 3MB)
if ($file['size'] > 3 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['error' => 'File too large']);
    exit;
}
// Validate file type
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

$allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png'];
if (!array_key_exists($mime, $allowed)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file type']);
    exit;
}

$ext = $allowed[$mime];
$profiles_dir = __DIR__ . '/../images/profiles';
if (!is_dir($profiles_dir)) {
    mkdir($profiles_dir, 0755, true);
}

$target = $profiles_dir . '/' . $user_id . '.' . $ext;

// Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $target)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file']);
    exit;
}


@chmod($target, 0644);

$public_path = 'images/profiles/' . $user_id . '.' . $ext;

// Update session to use new profile path
$_SESSION['profile_pic'] = $public_path;
// Persist avatar filename in DB (users.avatar)
// Connect to database
$conn = new mysqli($servername, $username, $password, $db_name);
if ($conn->connect_error) {
    // still return success for upload but warn in log
    error_log('DB connect error saving avatar: ' . $conn->connect_error);
    echo json_encode(['success' => true, 'path' => $public_path]);
    exit;
}
// Update avatar path

$stmt = $conn->prepare("UPDATE users SET avatar = ? WHERE user_id = ?");
if (!$stmt) {
    error_log('Prepare failed: ' . $conn->error);
    echo json_encode(['success' => false, 'error' => 'Database prepare error: ' . $conn->error]);
    $conn->close();
    exit;
}
// Bind parameters and execute
if (!$stmt->bind_param('si', $public_path, $user_id)) {
    error_log('Bind param failed: ' . $stmt->error);
    echo json_encode(['success' => false, 'error' => 'Database bind error: ' . $stmt->error]);
    $stmt->close();
    $conn->close();
    exit;
}
// Execute statement
if (!$stmt->execute()) {
    error_log('Execute failed: ' . $stmt->error);
    echo json_encode(['success' => false, 'error' => 'Database execute error: ' . $stmt->error]);
    $stmt->close();
    $conn->close();
    exit;
}
// Clean up
$stmt->close();
$conn->close();

echo json_encode(['success' => true, 'path' => $public_path]);
exit;

?>
