<?php
session_start();
header('Content-Type: application/json');

// Verificar si el usuario está autenticado
if (isset($_SESSION['username'])) {
    include 'dbplayforge.php';
    $database = new Database();
    $conn = $database->getConnection();

    // Consultar el correo electrónico y la foto de perfil del usuario
    $query = "SELECT email, foto_perfil FROM Usuarios WHERE nombre_usuario = :username";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':username', $_SESSION['username']);
    $stmt->execute();

    // Verificar si se encontraron resultados
    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode([
            'username' => $_SESSION['username'],
            'email' => $user['email'],
            'foto' => $user['foto_perfil']
        ]);
    } else {
        echo json_encode(['username' => 'Usuario']);
    }
} else {
    echo json_encode(['username' => 'Usuario']);
}
?>