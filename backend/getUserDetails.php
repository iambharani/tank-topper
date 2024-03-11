<?php

include 'db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Content-Type: application/json');

$user_id = isset($_GET['id']) ? $_GET['id'] : null;

if ($_SERVER["REQUEST_METHOD"] === "GET" && $user_id !== null) {
    if ($conn) {
        $query = "SELECT * FROM users WHERE id = ?";
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            echo json_encode(['error' => "Preparation failed: " . $conn->error]);
            exit;
        }

        $stmt->bind_param("i", $user_id);
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            if ($result->num_rows === 1) {
                $user = $result->fetch_assoc();
                
                // Assuming 'vehicles' is stored as a JSON string in your database
                // $user['vehicles'] = json_decode($user['vehicles'], true);

                // Correct response format for fetched user details
                $response = [
                    "message" => "User details fetched successfully.",
                    "user" => $user
                ];
                echo json_encode($response); // Send JSON response
            } else {
                echo json_encode(['error' => "User not found."]);
            }
        } else {
            echo json_encode(['error' => "Execution failed: " . $stmt->error]);
        }
        
        $stmt->close();
    } else {
        echo json_encode(['error' => "Database connection failed"]);
    }
    $conn->close();
} else {
    echo json_encode(['error' => 'Invalid request method or missing user ID. This endpoint only supports GET requests with a user ID.']);
}
?>
