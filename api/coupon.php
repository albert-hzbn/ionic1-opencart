<?php

require("db.php");

$_POST = json_decode(file_get_contents('php://input'), true);
$coupon_code=$_POST['coupon_code'];
$customer_id=$_POST['customer_id'];


/*$coupon_code='fyn100';
$customer_id=20;
*/
$q=mysqli_query($con,"SELECT * FROM `oc_coupon` WHERE code='$coupon_code' AND status='1'");

$coupon_details=mysqli_fetch_array($q);

$coupon_id=$coupon_details['coupon_id'];

$q=mysqli_query($con,"SELECT * FROM `oc_coupon_history` WHERE coupon_id='$coupon_id' AND customer_id='$customer_id'");

$coupon_history_details=mysqli_fetch_array($q);
$coupon_history_id=$coupon_history_details['coupon_history_id'];

if($coupon_details&&(($coupon_details['uses_customer']==1&&!$coupon_history_details)||$coupon_details['uses_customer']==0))
{
	echo '{ "status":"success",';
}
else{
	echo '{ "status":"failure",';
}

echo '"type":"'.$coupon_details['type'].'",';
echo '"discount":"'.$coupon_details['discount'].'",';
echo '"total":"'.$coupon_details['total'].'"}';


?>