<?php
include 'dbplayforge.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST['nombre'];
    $username = $_POST['username'];
    $correo = $_POST['correo'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $database = new Database();
    $conn = $database->getConnection();

    // Verificar si el nombre de usuario o el correo ya están en uso
    $query = "SELECT * FROM Usuarios WHERE nombre_usuario = ? OR email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(1, $username);
    $stmt->bindParam(2, $correo);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo "<script>alert('El nombre de usuario o el correo ya están en uso.'); window.history.back();</script>";
    } else {
        // Insertar el nuevo usuario en la base de datos
        $query = "INSERT INTO Usuarios (nombre_usuario, email, contraseña, fecha_creacion) VALUES (?, ?, ?, NOW())";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(1, $username);
        $stmt->bindParam(2, $correo);
        $stmt->bindParam(3, $password);

        if ($stmt->execute()) {
            echo "<script>alert('Usuario creado exitosamente.'); window.location.href = '../index.html';</script>";
        } else {
            echo "<script>alert('Error al crear el usuario.'); window.history.back();</script>";
        }
    }
    $conn = null;
}
?>