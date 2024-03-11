<?php
include 'db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$userData = json_decode(file_get_contents('php://input'), true);

$userId = $userData['id'] ?? null;
$username = $userData['username'] ?? '';
$email = $userData['email'] ?? '';
$userImage = $userData['userImage'] ?? '';
$vehicles = is_array($userData['vehicles']) ? $userData['vehicles'] : [];
$isActive = $userData['isActive'] ?? false; // Assume `isActive` is included in the request
$vehiclesJson = json_encode($vehicles);

if ($userId === null) {
    echo json_encode(["error" => "User ID is missing from the request"]);
    exit;
}

$sql = "UPDATE users SET username=?, email=?, userImage=?, vehicles=?, isActive=? WHERE id=?";

if ($stmt = $conn->prepare($sql)) {
    // Notice the addition of "i" at the end of the type specifier string for binding the `isActive` value as an integer
    $stmt->bind_param("ssssii", $username, $email, $userImage, $vehiclesJson, $isActive, $userId);

    if ($stmt->execute()) {
        $affectedRows = $stmt->affected_rows;
        $stmt->close(); // Close the statement as soon as you're done with it

        if ($affectedRows > 0) {
            // Fetch updated user details, including isActive status
            $fetchSql = "SELECT id, username, email, userImage, vehicles, isActive FROM users WHERE id = ?";
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
