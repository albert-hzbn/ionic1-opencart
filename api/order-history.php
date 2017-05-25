<?php

require("db.php");

$_POST = json_decode(file_get_contents('php://input'), true);

$session=$_POST['session'];

$q=mysqli_query($con,"SELECT customer_id FROM `oc_appsession` WHERE session='$session'");

$arr_data=mysqli_fetch_array($q);

$customer_id=$arr_data['customer_id'];
$str='';

$q=mysqli_query($con,"SELECT order_id,total FROM `oc_order` WHERE customer_id='$customer_id'");

$data=array();
while ($row=mysqli_fetch_array($q)){
 $data[]=$row;
}

echo '[';
$lastElement = end($data);
foreach ($data as $order){
	$order_id=(int)$order['order_id'];
	$total=$order['total'];
	$q=mysqli_query($con,"SELECT * FROM `oc_order_history` WHERE order_id='$order_id'
		");
	$data=mysqli_fetch_array($q);

	$order_history_id=$data['order_history_id'];
	$order_id=$data['order_id'];
	$order_status_id=$data['order_status_id'];
	$date_added=$data['date_added'];

	$q=mysqli_query($con,"SELECT name FROM `oc_order_status` WHERE order_status_id='$order_status_id'");
	$data_status=mysqli_fetch_array($q);
	$order_status=$data_status['name'];

	echo '{"order_history_id":'.'"'.$order_history_id.'","order_id":'.'"'.$order_id.'","order_status":'.'"'.$order_status.'","date_added":'.'"'.$date_added.'","total":'.'"'.$total.'"}';


	if($order!= $lastElement) {
	 	echo ",";
	}

}
echo ']';
?>