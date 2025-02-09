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

    // Verificar si se proporcionó el ID de la colección
    if (empty($collectionId)) {
        echo json_encode(['success' => false, 'message' => 'Collection ID not provided']);
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

    // Eliminar la colección de la base de datos
    $stmt = $conn->prepare("DELETE FROM colecciones WHERE id_coleccion = ?");
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
        exit;
    }

    $stmt->bind_param("i", $collectionId);

    // Ejecutar la eliminación y verificar el resultado
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to remove collection']);
    }

    $stmt->close();
    $conn->close();
?>
