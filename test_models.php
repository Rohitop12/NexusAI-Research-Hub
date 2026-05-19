<?php
$key = "AIzaSyA2TPaORKf8V-jjepjQXU8zj5m-GbwaFQU";
$url = "https://generativelanguage.googleapis.com/v1beta/models?key=" . $key;
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
$data = json_decode($response, true);
if (isset($data['models'])) {
    foreach ($data['models'] as $model) {
        if (strpos($model['name'], 'gemini') !== false) {
            echo $model['name'] . "\n";
        }
    }
} else {
    echo "Error: \n";
    print_r($data);
}
