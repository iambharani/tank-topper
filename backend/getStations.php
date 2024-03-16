<?php
// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Assuming the fuel type is passed as a query parameter in the URL
// $fuelType = isset($_GET['fuelType']) ? $_GET['fuelType'] : 'petrol';

// switch ($fuelType) {
//     case 'petrol':
//     case 'diesel':
//         // Mappls API for petrol and diesel stations
//         $url = "https://apis.mappls.com/advancedmaps/v1/YOUR_MAPPLS_API_KEY/nearby_search?keywords=fuel&refLocation=28.6315,77.2167"; // Example URL, adjust parameters as needed
//         break;

//     case 'cng':
// Torrent Gas API for CNG stations
$url = "https://connect.torrentgas.com/get_cng_station_list";
//         break;

//     default:
//         echo json_encode(['error' => 'Invalid fuel type']);
//         exit;
// }

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
