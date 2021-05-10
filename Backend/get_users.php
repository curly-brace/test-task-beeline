<?php
// кросс-ориджин можно ограничить внутренними доменами например, но тут пусть будет разрешено все
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
// можно использовать разные коды, в зависимости от результата, но ограничусь тут чисто 200 статусом
http_response_code(200);

// конечно можно разложить было по папкам красиво, config, classes, но тут не так много файлов, думаю так норм.
include_once 'db.php';

session_start();

$database = new Database();
$db = $database->getConnection();

// только админ!
if (isset($_SESSION["is_admin"]) && $_SESSION["is_admin"] == 1) {
	$q = "SELECT * FROM users";
	$q = $db->prepare($q);
	$q->execute();
	$num = $q->rowCount();

	$users = array();

	while ($row = $q->fetch(PDO::FETCH_ASSOC)) {
		array_push($users, array(
		  "id" => $row["id"],
		  "login" => $row["login"],
		  "is_admin" => ($row["is_admin"] == 1)
		));
	}

	echo json_encode($users, JSON_UNESCAPED_UNICODE);
} else {
	echo json_encode(array("result" => "error"), JSON_UNESCAPED_UNICODE);
}