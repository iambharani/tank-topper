<?php
// Enable CORS if you're calling this from a different domain
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Fetch state and district from the query parameters
$searchState = isset($_GET['search_state']) ? $_GET['search_state'] : '';
$searchDistrict = isset($_GET['search_district']) ? $_GET['search_district'] : '';

// Check if state and district are provided
if (empty($searchState) || empty($searchDistrict)) {
    echo json_encode(['error' => 'State or district not provided']);
    exit;
}

// The URL to fetch from
$url = "https://www.agppratham.com/cng/stations-locator?search_state={$searchState}&search_district={$searchDistrict}";

// Initialize cURL session
$ch = curl_init();

// Set cURL options
$cookies = "XSRF-TOKEN=eyJpdiI6IjhNU0g1eStsc3ZESTZrUmhVb3UxZGc9PSIsInZhbHVlIjoiUERycXBwRmZMTkNOUzRxcWRTZUFZOEpJdWJWL09SUUhJZ1ZUd0dZQllMNFY3Zk1DaW5hQ0FlZE1xblpjM3lJQTN3cVZueDA2STU5L05SakNyYXV1K1ZUM2Q3SVdSS250N05hR2ZXSUs3eloxbEo5RXNXUk9qa1ZFRlkveTNSamEiLCJtYWMiOiI5MTA3NmE0YTNiZWM0YTEwYjRmNGNhMDU2Y2U2MTE3NjY0NGQyYWNlMTFjMWU0YTI3MjNlMDUyYThlZDZkNjM3IiwidGFnIjoiIn0%3D;"; // Add more cookies as needed

// curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_COOKIE, $cookies);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);


// Execute cURL session
$response = curl_exec($ch);
// Close cURL session
curl_close($ch);

// Check if the response is not false
if ($response !== false) {
    // Output the response
    echo $response;
} else {
    echo json_encode(['error' => 'Failed to fetch data']);
}
?>
