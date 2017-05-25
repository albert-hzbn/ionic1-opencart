<?php

require("db.php");

$_POST = json_decode(file_get_contents('php://input'), true);


$firstname=$_POST['firstname'];
$lastname=$_POST['lastname'];
$email=$_POST['email'];
$telephone=$_POST['telephone'];
$password1=md5($_POST['password1']);
$password2=md5($_POST['password2']);
$address=$_POST['address'];
$city=$_POST['city'];
$postcode=$_POST['postcode'];

$user=false;



$password=$password1;
$q = mysqli_query($con,"SELECT * FROM `oc_customer` WHERE email='$email'");
$user_present=mysqli_fetch_array($q);
if($user_present){
	$message="email already exists";
	$user=true;
}



$q = mysqli_query($con,"SELECT * FROM `oc_customer` WHERE telephone='$telephone'");
$user_present=mysqli_fetch_array($q);
if($user_present){
	$message="phone no. already exists";
	$user=true;
}


$jsonstr = '{ "status":';

if(!$user){
	
	$q = mysqli_query($con,"SELECT address_id FROM `oc_address` ORDER BY address_id DESC");
	$data=mysqli_fetch_array($q);
	$address_id=(int)$data['address_id']+1;

	$customer_group_id=1;

	$h = "5.5";
	$hm = $h * 60; 
	$ms = $hm * 60;
	$gmdate = gmdate("Y:m:d H:i:s", time()+($ms));
	echo $gmdate;


	$q = mysqli_query($con,"INSERT INTO `oc_customer`(customer_group_id,firstname,lastname,email,telephone,password,address_id,status,approved,date_added) VALUES('$customer_group_id','$firstname','$lastname','$email','$telephone','$password','$address_id','1','1','$gmdate')");


	$q = mysqli_query($con,"SELECT customer_id FROM `oc_customer` ORDER BY customer_id DESC");
	$data=mysqli_fetch_array($q);
	$customer_id=(int)$data['customer_id'];

	
	$q = mysqli_query($con,"INSERT INTO `oc_address`(customer_id,customer_group_id,firstname,lastname,address_1,city,postcode) VALUES('$customer_id','$customer_group_id','$firstname','$lastname','$address','$city','$postcode') ");

	$status='success';
	$message="succussfully registered";
}
else{
	$status='failed';
}

$jsonstr.='"'.$status.'","message":"'.$message.'"}';

echo $jsonstr;

?>