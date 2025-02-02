
<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['username'])) {
    include 'dbplayforge.php';
    $database = new Database();
    $conn = $database->getConnection();

    $query = "SELECT email, foto_perfil FROM Usuarios WHERE nombre_usuario = :username";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':username', $_SESSION['username']);
    $stmt->execute();

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