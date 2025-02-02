<?php
include 'dbplayforge.php'; // Incluir el archivo de conexión a la base de datos

// Obtener la conexión a la base de datos
$database = new Database();
$conn = $database->getConnection();

// Consultar los videojuegos
$query = "SELECT titulo, plataforma, imagen_url FROM videojuegos";
$stmt = $conn->prepare($query);
$stmt->execute();

// Obtener los resultados
$videojuegos = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Devolver los resultados en formato JSON
header('Content-Type: application/json');
echo json_encode($videojuegos);

$conn = null; // Cerrar la conexión
?>