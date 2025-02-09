<?php
    header('Content-Type: application/json');

    session_start();
    // Verificar si el usuario está autenticado
    if (!isset($_SESSION['username'])) {
        echo json_encode(['success' => false, 'message' => 'User not authenticated']);
        exit;
    }

    $username = $_SESSION['username'];
    $input = json_decode(file_get_contents('php://input'), true);
    $collectionName = $input['collectionName'] ?? '';

    // Verificar si se proporcionó el nombre de la colección
    if (empty($collectionName)) {
        echo json_encode(['success' => false, 'message' => 'Collection name not provided']);
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

    // Obtener el id_usuario basado en el nombre de usuario
    $stmt = $conn->prepare("SELECT id_usuario FROM usuarios WHERE nombre_usuario = ?");
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
        exit;
    }

    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->bind_result($userId);
    $stmt->fetch();
    $stmt->close();

    // Verificar si se encontró el ID del usuario
    if (!$userId) {
        echo json_encode(['success' => false, 'message' => 'User ID not found']);
        exit;
    }

    // Insertar la nueva colección en la base de datos
    $stmt = $conn->prepare("INSERT INTO colecciones (nombre_coleccion, id_usuario, fecha_creacion) VALUES (?, ?, NOW())");
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
        exit;
    }

    $stmt->bind_param("si", $collectionName, $userId);

    // Ejecutar la inserción y verificar el resultado
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add collection']);
    }

    $stmt->close();
    $conn->close();
?>
