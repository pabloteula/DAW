<?php
    header('Content-Type: application/json');

    session_start();
    // Verificar si el usuario está autenticado
    if (!isset($_SESSION['username'])) {
        echo json_encode([]);
        exit;
    }

    $collectionId = $_GET['collectionId'] ?? '';

    // Verificar si se proporcionó el ID de la colección
    if (empty($collectionId)) {
        echo json_encode([]);
        exit;
    }

    $servername = "localhost";
    $dbUsername = "root";
    $dbPassword = "";
    $dbname = "db_playforge";

    $conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);

    // Verificar la conexión a la base de datos
    if ($conn->connect_error) {
        echo json_encode([]);
        exit;
    }

    // Consultar los juegos en la colección
    $stmt = $conn->prepare("
        SELECT videojuegos.id_videojuego, videojuegos.titulo, videojuegos.imagen_url, videojuegos.plataforma
        FROM coleccion_videojuego
        JOIN videojuegos ON coleccion_videojuego.id_videojuego = videojuegos.id_videojuego
        WHERE coleccion_videojuego.id_coleccion = ?
    ");
    if (!$stmt) {
        echo json_encode([]);
        exit;
    }

    $stmt->bind_param("i", $collectionId);
    $stmt->execute();
    $result = $stmt->get_result();
    $games = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    $conn->close();

    // Devolver los resultados en formato JSON
    echo json_encode($games);
?>
