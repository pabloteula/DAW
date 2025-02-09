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
    $collectionId = $input['collectionId'] ?? '';
    $imageUrl = $input['imageUrl'] ?? '';

    // Verificar si se proporcionaron el ID de la colección y la URL de la imagen
    if (empty($collectionId) || empty($imageUrl)) {
        echo json_encode(['success' => false, 'message' => 'Collection ID or image URL not provided']);
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

    // Obtener el id_videojuego basado en la URL de la imagen
    $stmt = $conn->prepare("SELECT id_videojuego FROM videojuegos WHERE imagen_url = ?");
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
        exit;
    }

    $stmt->bind_param("s", $imageUrl);
    $stmt->execute();
    $stmt->bind_result($gameId);
    $stmt->fetch();
    $stmt->close();

    // Verificar si se encontró el ID del juego
    if (!$gameId) {
        echo json_encode(['success' => false, 'message' => 'Game ID not found']);
        exit;
    }

    // Insertar el juego en la colección
    $stmt = $conn->prepare("INSERT INTO coleccion_videojuego (id_coleccion, id_videojuego, fecha_agregado) VALUES (?, ?, NOW())");
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
        exit;
    }

    $stmt->bind_param("ii", $collectionId, $gameId);

    // Ejecutar la inserción y verificar el resultado
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add game to collection']);
    }

    $stmt->close();
    $conn->close();
?>
