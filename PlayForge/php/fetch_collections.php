<?php
    header('Content-Type: application/json');

    session_start();
    // Verificar si el usuario está autenticado
    if (!isset($_SESSION['username'])) {
        echo json_encode([]);
        exit;
    }

    $username = $_SESSION['username'];

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

    // Obtener el id_usuario basado en el nombre de usuario
    $stmt = $conn->prepare("SELECT id_usuario FROM usuarios WHERE nombre_usuario = ?");
    if (!$stmt) {
        echo json_encode([]);
        exit;
    }

    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->bind_result($userId);
    $stmt->fetch();
    $stmt->close();

    // Verificar si se encontró el ID del usuario
    if (!$userId) {
        echo json_encode([]);
        exit;
    }

    // Obtener las colecciones del usuario
    $stmt = $conn->prepare("SELECT id_coleccion, nombre_coleccion FROM colecciones WHERE id_usuario = ?");
    if (!$stmt) {
        echo json_encode([]);
        exit;
    }

    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $collections = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    $conn->close();

    // Devolver las colecciones en formato JSON
    echo json_encode($collections);
?>
