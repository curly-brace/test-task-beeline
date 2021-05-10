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

// проверяем первым делом, вдруг там вообще ничего нет?)
$data = json_decode(file_get_contents("php://input"));

if (!empty($data) && is_array($data) && count($data) > 0) {
	session_start();

	$database = new Database();
	$db = $database->getConnection();

	// только админ!
	if (isset($_SESSION["is_admin"]) && $_SESSION["is_admin"] == 1) {
		// на всякий пожарный тут конвертирую элменты массива в числа, хотя тут лучше сделать более тщательную проверку на стороне браузера
		$q = "DELETE FROM users WHERE id IN (" . implode(',', array_map('intval', $data)) . ")";
		$db->prepare($q)->execute();
	}
}