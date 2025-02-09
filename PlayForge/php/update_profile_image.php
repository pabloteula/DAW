<?php
    header('Content-Type: application/json');

    session_start();
    // Verificar si el usuario está autenticado
    if (!isset($_SESSION['username'])) {
        echo json_encode(['success' => false, 'message' => 'User not authenticated']);
        exit;
    }

    $username = $_SESSION['username']; // Nombre de usuario almacenado en la sesión

    $input = json_decode(file_get_contents('php://input'), true);
    $newImageUrl = $input['newImageUrl'] ?? '';

    // Verificar si se proporcionó la URL de la nueva imagen
    if (empty($newImageUrl)) {
        echo json_encode(['success' => false, 'message' => 'No image URL provided']);
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

    // Actualizar la imagen de perfil
    $stmt = $conn->prepare("UPDATE usuarios SET foto_perfil = ? WHERE id_usuario = ?");
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
        exit;
    }

    $stmt->bind_param("si", $newImageUrl, $userId);

    // Ejecutar la actualización y verificar el resultado
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update profile image']);
    }

    $stmt->close();
    $conn->close();
?>
