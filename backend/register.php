<?php

include 'db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER["REQUEST_METHOD"] === "POST" && !empty($data)) {
    $username = filter_var($data['username'], FILTER_SANITIZE_STRING);
    $email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
    $password = $data['password'];
    $latitude = filter_var($data['location']['latitude'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $longitude = filter_var($data['location']['longitude'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $hasLocationPermission = filter_var($data['hasLocationPermission'], FILTER_VALIDATE_BOOLEAN);

    if (!$email) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Assuming default or fetched values for userImage and vehicles
    $isActive = 0; // Since you are setting isActive directly in your query
    $userImage = ''; // Example default or fetched value
    $vehicles = []; // Assuming an empty array for demonstration, or fetch actual data

    $stmt = $conn->prepare("INSERT INTO users (username, email, password, isActive, location_permission) VALUES (?, ?, ?, ?, ?)");
    if (!$stmt) {
        echo "Prepare failed: (" . $conn->errno . ") " . $conn->error;
        exit;
    }
    
    $stmt->bind_param("sssdi", $username, $email, $hashedPassword, $isActive, $hasLocationPermission);
     

    if ($stmt->execute()) {
        $userId = $stmt->insert_id; // Get the auto-generated user ID

        // You might want to fetch $userImage and $vehicles from the database if they are not static/default

        echo json_encode([
            'success' => true, 
            'message' => 'New record created successfully',
            'user' => [
                'id' => $userId,
                'username' => $username,
                'email' => $email,
                'isActive' => $isActive,
                'latitude' => $latitude,
                'longitude' => $longitude,
                'userImage' => $userImage,
                'vehicles' => $vehicles
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method or empty data.']);
}

?>
