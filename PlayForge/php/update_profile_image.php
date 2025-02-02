<?php
header('Content-Type: application/json');

session_start();
if (!isset($_SESSION['id'])) {
    echo json_encode(['success' => false, 'message' => 'User not authenticated']);
    exit;
}

$userId = $_SESSION['id'];

$input = json_decode(file_get_contents('php://input'), true);
$newImageUrl = $input['newImageUrl'] ?? '';

if (empty($newImageUrl)) {
    echo json_encode(['success' => false, 'message' => 'No image URL provided']);
    exit;
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "db_playforge";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$stmt = $conn->prepare("UPDATE usuarios SET foto_perfil = ? WHERE id_usuario = ?");
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
    exit;
}

$stmt->bind_param("si", $newImageUrl, $userId);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update profile image']);
}

$stmt->close();
$conn->close();
?>