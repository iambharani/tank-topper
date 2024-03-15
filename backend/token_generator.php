// token_generator.php
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Content-Type: application/json');

$client_id = '96dHZVzsAutJdIJ534tU3IYW9X-G1T7C2VlWDdjyF5tWAQ-T1PwFaLcweEcVRehK2pppLPbkB-Yw_Kaf0qUjXQ==';
$client_secret = 'lrFxI-iSEg_yNWjeoBuxcnsF1aaE6ivgKX4ZZrdPeD6OhAOUyS-h2hgJu82Q5ppjIDCkPPmLXiC_zBA8RgmmojFvGcvgvosL';
$grant_type = 'client_credentials'; // As specified by the API

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://outpost.mappls.com/api/security/oauth/token");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'grant_type' => $grant_type,
    'client_id' => $client_id,
    'client_secret' => $client_secret
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$headers = [
    'Content-Type: application/x-www-form-urlencoded',
];

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);
$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);   // Get the HTTP status code

curl_close($ch);

if ($status_code == 200) {
    // Successfully received the token
    $tokenInfo = json_decode($response, true);
    // echo $tokenInfo;
    // die;
    echo json_encode($tokenInfo);
} else {
    // Handle errors, e.g., invalid credentials, API errors, etc.
    http_response_code($status_code);
    echo $response;
}
