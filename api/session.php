<?php

require("db.php");

$_POST = json_decode(file_get_contents('php://input'), true);

$session=$_POST['session'];


$str='SELECT *  FROM `oc_customer` WHERE customer_id=(SELECT customer_id FROM `oc_appsession` WHERE session="'.$session.'")';

$q=mysqli_query($con,$str);

$row=mysqli_fetch_object($q);
$data=$row;
if($data){
	echo json_encode($data);
}

?>