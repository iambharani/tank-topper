<?php
include 'db.php';
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
$data = json_decode(file_get_contents('php://input'), true);

$response = ['success' => false, 'message' => 'Invalid request', 'user' => null];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $data['email'];
    $password = $data['password'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            session_start();
            $_SESSION['user_id'] = $user['id'];

            unset($user['password']);

            $response = ['success' => true, 'message' => 'Login successful', 'user' => $user];
        } else {
            $response['message'] = 'Invalid email or password';
        }
    } else {
        $response['message'] = 'Invalid email or password';
    }

    $stmt->close();
    $conn->close();
}

echo json_encode($response);
?>
