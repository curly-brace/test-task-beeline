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

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->login) && !empty($data->password)) {
	$q = "SELECT * FROM users WHERE login = ".$db->quote($data->login);
	$q = $db->prepare($q);
	$q->execute();
	$num = $q->rowCount();
	$user = $q->fetch(PDO::FETCH_ASSOC);

	if ($num > 0 && $user["login"] == $data->login && $user["password"] == $data->password) {
		session_start();
		$_SESSION["user"] = $user["login"];
		$_SESSION["is_admin"] = $user["is_admin"];
		echo json_encode(array("result" => "success"), JSON_UNESCAPED_UNICODE);
		exit();
	}
}
echo json_encode(array("result" => "error"), JSON_UNESCAPED_UNICODE);