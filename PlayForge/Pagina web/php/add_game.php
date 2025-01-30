<?php
include 'dbplayforge.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $titulo = $_POST['titulo'];
    $plataforma = $_POST['plataforma'];
    $imagen = $_FILES['imagen'];
    $ruta = $_POST['ruta'];

    if ($imagen['error'] === UPLOAD_ERR_OK) {
        $imagen_url = 'img/' . $ruta . '/' . basename($imagen['name']);
        move_uploaded_file($imagen['tmp_name'], '../' . $imagen_url);

        $database = new Database();
        $conn = $database->getConnection();

        $query = "INSERT INTO videojuegos (titulo, plataforma, imagen_url) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(1, $titulo);
        $stmt->bindParam(2, $plataforma);
        $stmt->bindParam(3, $imagen_url);

        if ($stmt->execute()) {
            echo "<script>alert('Juego añadido exitosamente.'); window.location.href = '../add_game.html';</script>";
        } else {
            echo "<script>alert('Error al añadir el juego.'); window.location.href = '../add_game.html';</script>";
        }

        $conn = null;
    } else {
        echo "<script>alert('Error al subir la imagen.'); window.location.href = '../add_game.html';</script>";
    }
}
?>
