<?php
// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$url = "https://connect.torrentgas.com/get_cng_station_list";

// Initialize cURL session
$curl = curl_init($url);

// Set cURL options
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPGET, true);
curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; YourBot/1.0)');

// Execute cURL request
$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

// Check for errors or unexpected HTTP responses
if (curl_errno($curl)) {
    echo json_encode(['error' => 'CURL Error: ' . curl_error($curl)]);
} elseif ($httpCode != 200) {
    echo json_encode(['error' => 'Unexpected HTTP response: ' . $httpCode]);
} else {
    // Print response if no errors
    echo $response;
}

// Close cURL session
curl_close($curl);
