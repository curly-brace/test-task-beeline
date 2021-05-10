<?php
// кросс-ориджин можно ограничить внутренними доменами например, но тут пусть будет разрешено все
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
// можно использовать разные коды, в зависимости от результата, но ограничусь тут чисто 200 статусом
http_response_code(200);

session_start();

if (isset($_SESSION["user"])) {
	echo json_encode(array("login" => $_SESSION["user"], "is_admin" => $_SESSION["is_admin"]), JSON_UNESCAPED_UNICODE);
} else {
	echo json_encode(array("login" => "none"), JSON_UNESCAPED_UNICODE);
}