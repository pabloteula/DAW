<?php
session_start();
include 'db_connection.php'; // Include your database connection file

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Default username and password for testing
    $default_username = 'pabloteula';
    $default_password = '1234';

    if ($username === $default_username && $password === $default_password) {
        $_SESSION['loggedin'] = true;
        $_SESSION['username'] = $username;
        $_SESSION['id'] = 1; // Default ID for testing
        header('Location: home.html'); // Redirect to home page
    } else {
        // Create a prepared statement
        if ($stmt = $conn->prepare('SELECT id, password FROM users WHERE username = ?')) {
            $stmt->bind_param('s', $username);
            $stmt->execute();
            $stmt->store_result();

            // Check if the username exists
            if ($stmt->num_rows > 0) {
                $stmt->bind_result($id, $hashed_password);
                $stmt->fetch();

                // Verify the password
                if (password_verify($password, $hashed_password)) {
                    // Password is correct, start a session
                    $_SESSION['loggedin'] = true;
                    $_SESSION['username'] = $username;
                    $_SESSION['id'] = $id;
                    header('Location: home.html'); // Redirect to home page
                } else {
                    echo 'Incorrect password!';
                }
            } else {
                echo 'Incorrect username!';
            }
            $stmt->close();
        }
    }
}
$conn->close();
?>
