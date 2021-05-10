<?php
class Database {

    private $host = "localhost";
    private $db_name = "test";
    private $username = "root";
    private $password = ""; //ну это ж тестовое задание, а не боевая бд)))
    public $conn;

    public function getConnection(){

        $this->conn = null;

        try {
			// я знаю про MySQLi, но оно вроде не на всех хостингах есть и вообще редко используется, а PDO это классика
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>