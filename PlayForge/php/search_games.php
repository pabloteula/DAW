<?php
$host = 'localhost';
$db = 'db_playforge';
$user = 'root';
$pass = '';

$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed', 'details' => $e->getMessage()]);
    exit;
}

$query = $_GET['query'] ?? '';
try {
    if ($query) {
        $stmt = $pdo->prepare('SELECT * FROM videojuegos WHERE titulo LIKE ?');
        $stmt->execute(["%$query%"]);
    } else {
        $stmt = $pdo->query('SELECT * FROM videojuegos');
    }
    $games = $stmt->fetchAll();
    if (empty($games)) {
        echo json_encode(['error' => 'No games found']);
    } else {
        echo json_encode($games);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Query execution failed', 'details' => $e->getMessage()]);
}
?>

