<?php
include 'db.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$userData = json_decode(file_get_contents('php://input'), true);

$userId = $userData['id'] ?? null;
$username = $userData['username'] ?? '';
$email = $userData['email'] ?? '';
$vehicles = is_array($userData['vehicles']) ? $userData['vehicles'] : [];
$isActive = $userData['isActive'] ?? false;
$vehiclesJson = json_encode($vehicles);
$userImage = ''; // Initialize as empty, to be updated if a new image is uploaded

// Process image upload if present
if (isset($_FILES['userImage'])) {
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["userImage"]["name"]);

    // Add any desired file validation here (e.g., file size, type)

    if (move_uploaded_file($_FILES["userImage"]["tmp_name"], $target_file)) {
        // On successful upload, update userImage variable to the path of the uploaded file
        $userImage = $target_file;
    } else {
        echo json_encode(["error" => "Error uploading file."]);
        exit;
    }
} else {
    // If no image is uploaded, retain the existing image path from the request
    $userImage = $userData['userImage'] ?? '';
}

if ($userId === null) {
    echo json_encode(["error" => "User ID is missing from the request"]);
    exit;
}

// Prepare SQL statement for updating user details
$sql = "UPDATE users SET username=?, email=?, userImage=?, vehicles=?, isActive=? WHERE id=?";

if ($stmt = $conn->prepare($sql)) {
    // Cast isActive to integer
    $isActive = $isActive ? 1 : 0;
    $stmt->bind_param("ssssii", $username, $email, $userImage, $vehiclesJson, $isActive, $userId);

    if ($stmt->execute()) {
        $affectedRows = $stmt->affected_rows;
        $stmt->close();

        // If the update was successful, fetch the updated user details
        if ($affectedRows > 0) {
            $fetchSql = "SELECT id, username, email, userImage, vehicles, isActive FROM users WHERE id=?";
            if ($fetchStmt = $conn->prepare($fetchSql)) {
                $fetchStmt->bind_param("i", $userId);
                $fetchStmt->execute();
                $result = $fetchStmt->get_result();
                if ($user = $result->fetch_assoc()) {
                    $user['vehicles'] = json_decode($user['vehicles'], true);
                    echo json_encode(["message" => "User details updated successfully.", "user" => $user]);
                } else {
                    echo json_encode(["error" => "Failed to fetch updated user details."]);
                }
                $fetchStmt->close();
            } else {
                echo json_encode(["error" => "Failed to prepare fetch statement.", "mysqli_error" => $conn->error]);
            }
        } else {
            echo json_encode(["message" => "No user details were updated. Possibly no changes."]);
        }
    } else {
        echo json_encode(["error" => "Failed to execute the SQL statement.", "mysqli_error" => $stmt->error]);
    }
} else {
    echo json_encode(["error" => "Failed to prepare the update SQL statement.", "mysqli_error" => $conn->error]);
}

$conn->close();
?>
