<?php
    header('Content-Type: application/json');

    session_start();
    // Verificar si el usuario está autenticado
    if (!isset($_SESSION['username'])) {
        echo json_encode(['success' => false, 'message' => 'User not authenticated']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $collectionId = $input['collectionId'] ?? '';
    $gameId = $input['gameId'] ?? '';

    // Verificar si se proporcionaron el ID de la colección y el ID del juego
    if (empty($collectionId) || empty($gameId)) {
        echo json_encode(['success' => false, 'message' => 'Collection ID or game ID not provided']);
        exit;
    }

    $servername = "localhost";
    $dbUsername = "root";
    $dbPassword = "";
    $dbname = "db_playforge";

    $conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);

    // Verificar la conexión a la base de datos
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit;
    }

    // Eliminar el juego de la colección
    $stmt = $conn->prepare("DELETE FROM coleccion_videojuego WHERE id_coleccion = ? AND id_videojuego = ?");
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
        exit;
    }

    $stmt->bind_param("ii", $collectionId, $gameId);

    // Ejecutar la eliminación y verificar el resultado
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to remove game from collection']);
    }

    $stmt->close();
    $conn->close();
?>
