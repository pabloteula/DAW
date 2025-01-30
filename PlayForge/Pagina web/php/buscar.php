<?php
    // Conexión a la base de datos
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "db_playforge";

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch(PDOException $e) {
        echo "Connection failed: " . $e->getMessage();
        exit();
    }

    // Obtener el término de búsqueda
    $query = isset($_GET['query']) ? $_GET['query'] : '';

    // Consulta a la base de datos
    $sql = "SELECT nombre, imagen FROM videojuegos WHERE nombre LIKE :query";
    $stmt = $conn->prepare($sql);
    $searchTerm = "%" . $query . "%";
    $stmt->bindParam(':query', $searchTerm);
    $stmt->execute();

    // Obtener los resultados
    $videojuegos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Debug: Check if any results are returned
    if (empty($videojuegos)) {
        echo json_encode(['error' => 'No results found']);
        exit();
    }

    // Devolver los resultados en formato JSON
    header('Content-Type: application/json');
    echo json_encode($videojuegos);

    $conn = null; // Cerrar la conexión
?>