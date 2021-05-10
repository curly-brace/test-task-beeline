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

//тут еще можно добавить проверку более подробную, например есть ли уже такой юзер, правильность имени и все такое
//но как-то нет особо времени на это сейчас
if (!empty($data->login) && !empty($data->password)) {
	$q = "INSERT INTO users (login, password, is_admin) VALUES (?,?,?)";
	//PDO самостоятельно борется с sql-injection, поэтому никаких mysql_escape_string нету =)
	$db->prepare($q)->execute([$data->login, $data->password, 0]);
	
	// для автоапдейта
	$q = "INSERT INTO feed (feed_ready) VALUES (1)";
	$db->prepare($q)->execute();
}