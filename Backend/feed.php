<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
	
include_once 'db.php';

$database = new Database();
$db = $database->getConnection();

$q = "SELECT * FROM feed";
$q = $db->prepare($q);
$q->execute();
$num = $q->rowCount();

if ($num > 0) {
	$q = "TRUNCATE TABLE feed;";
	$db->prepare($q)->execute();
	
	echo "data: table updated!\n\n";
	ob_flush();
	flush();
}