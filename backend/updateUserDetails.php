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
$userImage = '';

if (isset($_FILES['userImage'])) {
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["userImage"]["name"]);
    if (move_uploaded_file($_FILES["userImage"]["tmp_name"], $target_file)) {
        $userImage = $target_file;
    } else {
        echo json_encode(["error" => "Error uploading file."]);
        exit;
    }
} else {
    $userImage = $userData['userImage'] ?? '';
}

if ($userId === null) {
    echo json_encode(["error" => "User ID is missing from the request"]);
    exit;
}

$sql = "UPDATE users SET username=?, email=?, userImage=?, vehicles=?, isActive=? WHERE id=?";

if ($stmt = $conn->prepare($sql)) {
    $isActive = $isActive ? 1 : 0;
    $stmt->bind_param("ssssii", $username, $email, $userImage, $vehiclesJson, $isActive, $userId);

    if ($stmt->execute()) {
        $affectedRows = $stmt->affected_rows;
        $stmt->close();
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
