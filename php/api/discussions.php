<?php
// php/api/discussions.php
// GET ?volumeId=... -> list discussions
// POST (JSON) { volumeId, author, title, content } -> create discussion

header('Content-Type: application/json');

// Load .env file if exists
function load_env_file($path) {
    $env = [];
    if (!file_exists($path)) return $env;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') continue;
        if (strpos($line, '=') === false) continue;
        list($key, $val) = explode('=', $line, 2);
        $key = trim($key);
        $val = trim($val);
        $val = preg_replace('/^"(.*)"$/', '$1', $val);
        $env[$key] = $val;
    }
    return $env;
}
// Determine project root and load env

$root = dirname(__DIR__, 2);
$env = load_env_file($root . DIRECTORY_SEPARATOR . '.env');

$dbHost = getenv('DB_HOST') ?: ($env['DB_HOST'] ?? null);
$dbUser = getenv('DB_USER') ?: ($env['DB_USER'] ?? null);
$dbPass = getenv('DB_PASS') ?: ($env['DB_PASS'] ?? null);
$dbName = getenv('DB_NAME') ?: ($env['DB_NAME'] ?? null);

// Connect to database

if (!$dbHost || !$dbUser || !$dbName) {
    http_response_code(500);
    echo json_encode(['error' => 'Database not configured. Set DB_HOST, DB_USER, DB_PASS, DB_NAME in .env']);
    exit;
}

$mysqli = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connection failed', 'detail' => $mysqli->connect_error]);
    exit;
}

// create table if missing
$createSql = "CREATE TABLE IF NOT EXISTS discussions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    volume_id VARCHAR(255) NOT NULL,
    parent_id INT DEFAULT NULL,
    author VARCHAR(255) DEFAULT NULL,
    title VARCHAR(255) DEFAULT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
$mysqli->query($createSql);

// Add parent_id column if it doesn't exist (migration)
$checkColumn = $mysqli->query("SHOW COLUMNS FROM discussions LIKE 'parent_id'");
if ($checkColumn->num_rows === 0) {
    $mysqli->query("ALTER TABLE discussions ADD COLUMN parent_id INT DEFAULT NULL AFTER volume_id");
    $mysqli->query("ALTER TABLE discussions ADD FOREIGN KEY (parent_id) REFERENCES discussions(id) ON DELETE CASCADE");
}

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
    $volumeId = isset($_GET['volumeId']) ? trim($_GET['volumeId']) : '';
    if ($volumeId === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Missing volumeId']);
        exit;
    }

    $stmt = $mysqli->prepare('SELECT id, volume_id, parent_id, author, title, content, created_at FROM discussions WHERE volume_id = ? ORDER BY created_at ASC');
    $stmt->bind_param('s', $volumeId);
    $stmt->execute();
    $res = $stmt->get_result();
    $rows = [];
    while ($r = $res->fetch_assoc()) {
        $r['replies'] = [];
        $rows[] = $r;
    }
    
    // Organize into parent/reply structure
    $byId = [];
    $topLevel = [];
    foreach ($rows as &$row) {
        $byId[$row['id']] = &$row;
    }
    foreach ($rows as &$row) {
        if ($row['parent_id'] === null) {
            $topLevel[] = &$row;
        } else {
            if (isset($byId[$row['parent_id']])) {
                $byId[$row['parent_id']]['replies'][] = &$row;
            }
        }
    }
    
    echo json_encode($topLevel);
    exit;
}

// Handle POST to create new discussion and replies
// Expect JSON body
// Required: volumeId, content

if ($method === 'POST') {
    // accept JSON body
    $body = file_get_contents('php://input');
    $data = json_decode($body, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }
    $volumeId = trim($data['volumeId'] ?? '');
    $parentId = isset($data['parentId']) ? intval($data['parentId']) : null;
    $author = trim($data['author'] ?? '');
    $title = trim($data['title'] ?? '');
    $content = trim($data['content'] ?? '');

    if ($volumeId === '' || $content === '') {
        http_response_code(400);
        echo json_encode(['error' => 'volumeId and content are required']);
        exit;
    }

    $stmt = $mysqli->prepare('INSERT INTO discussions (volume_id, parent_id, author, title, content) VALUES (?, ?, ?, ?, ?)');
    $stmt->bind_param('sisss', $volumeId, $parentId, $author, $title, $content);
    $ok = $stmt->execute();
    // Check for insertion errors
    if (!$ok) {
        http_response_code(500);
        echo json_encode(['error' => 'Insert failed', 'detail' => $stmt->error]);
        exit;
    }
    // Return the created discussion
    $id = $stmt->insert_id;
    $stmt2 = $mysqli->prepare('SELECT id, volume_id, parent_id, author, title, content, created_at FROM discussions WHERE id = ?');
    $stmt2->bind_param('i', $id);
    $stmt2->execute();
    $res = $stmt2->get_result();
    $row = $res->fetch_assoc();
    $row['replies'] = [];
    echo json_encode($row);
    exit;
}

// Method not allowed
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);

