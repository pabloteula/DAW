<?php
session_start();
include 'dbplayforge.php'; // Incluir el archivo de conexión a la base de datos

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Obtener la conexión a la base de datos
    $database = new Database();
    $conn = $database->getConnection();

    // Crear una declaración preparada
    $query = 'SELECT id_usuario, contraseña FROM Usuarios WHERE nombre_usuario = :username';
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->execute();

    // Verificar si el nombre de usuario existe
    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $id_usuario = $user['id_usuario'];
        $hashed_password = $user['contraseña'];

        // Verificar la contraseña
        if (password_verify($password, $hashed_password)) {
            // La contraseña es correcta, iniciar sesión
            $_SESSION['loggedin'] = true;
            $_SESSION['username'] = $username;
            $_SESSION['id'] = $id_usuario;
            header('Location: ../home.html'); // Redirigir a la página de inicio
            exit();
        } else {
            echo "<script>alert('¡Contraseña incorrecta!'); window.history.back();</script>";
        }
    } else {
        echo "<script>alert('¡Nombre de usuario incorrecto!'); window.history.back();</script>";
    }

    $conn = null; // Cerrar la conexión
}
?>