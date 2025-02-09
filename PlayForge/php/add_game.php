<?php
include 'dbplayforge.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $titulo = $_POST['titulo'];
    $plataforma = $_POST['plataforma'];
    $año_lanzamiento = $_POST['año_lanzamiento'];
    $desarrollador = $_POST['desarrollador'];
    $imagen = $_FILES['imagen'];
    $ruta = $_POST['ruta'];

    // Verificar si la imagen se subió correctamente
    if ($imagen['error'] === UPLOAD_ERR_OK) {
        $imagen_url = 'img/' . $ruta . '/' . basename($imagen['name']);
        move_uploaded_file($imagen['tmp_name'], '../' . $imagen_url);

        $database = new Database();
        $conn = $database->getConnection();

        // Insertar el nuevo juego en la base de datos
        $query = "INSERT INTO videojuegos (titulo, plataforma, año_lanzamiento, desarrollador, imagen_url) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(1, $titulo);
        $stmt->bindParam(2, $plataforma);
        $stmt->bindParam(3, $año_lanzamiento);
        $stmt->bindParam(4, $desarrollador);
        $stmt->bindParam(5, $imagen_url);

        if ($stmt->execute()) {
            echo "<script>alert('Juego añadido exitosamente.'); window.location.href = '../addgame.html';</script>";
        } else {
            echo "<script>alert('Error al añadir el juego.'); window.location.href = '../addgame.html';</script>";
        }

        $conn = null;
    } else {
        echo "<script>alert('Error al subir la imagen.'); window.location.href = '../addgame.html';</script>";
    }
}
?>
