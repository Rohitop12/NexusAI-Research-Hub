<?php
$url = 'http://127.0.0.1:8000/api/chat/message';
$data = json_encode(['message' => 'Hello, this is a test from the backend.']);

$options = [
    'http' => [
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => $data,
    ],
];
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
if ($result === FALSE) {
    echo "Error calling API\n";
} else {
    echo $result;
}
