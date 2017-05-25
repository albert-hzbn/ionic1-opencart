<?php

//require("core.php");
require("db.php");

$_POST = json_decode(file_get_contents('php://input'), true);


$username=$_POST['username'];
$password=$_POST['password'];


if(is_numeric ($username)){
	$q = mysqli_query($con,"SELECT * FROM " . "oc_customer WHERE telephone = '" . $username . "' AND (password = SHA1(CONCAT(salt, SHA1(CONCAT(salt, SHA1('" . $password . "'))))) OR password = '" . md5($password) . "') AND status = '1' AND approved = '1'");

}
else{
	$q = mysqli_query($con,"SELECT * FROM " . "oc_customer WHERE LOWER(email) = '" . $username . "' AND (password = SHA1(CONCAT(salt, SHA1(CONCAT(salt, SHA1('" . $password . "'))))) OR password = '" . md5($password) . "') AND status = '1' AND approved = '1'");
}



$data=mysqli_fetch_array($q);

$jsonstr='[{"status":';

if($data){
	$str=$data['telephone'].$data['password'];
	$session=md5($str);
	$jsonstr.='"success"},{"session":"'.$session.'"}]';

	$q = mysqli_query($con,"SELECT session FROM `oc_appsession` WHERE session='$session'");
	$s=mysqli_fetch_array($q);
	if(!$s){

		$customer_id=$data['customer_id'];
		$q = mysqli_query($con,"INSERT INTO `oc_appsession` (customer_id,session) VALUES ('$customer_id','$session')");
	}
}
else{
	$jsonstr.='"failed"}]';
}

echo $jsonstr;

?>