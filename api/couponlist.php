<?php

require("db.php");

// $_POST = json_decode(file_get_contents('php://input'), true);
$q=mysqli_query($con,"SELECT * FROM `oc_coupon` WHERE status='1'");

$data=array();
while ($row=mysqli_fetch_object($q)){
 $data[]=$row;
}
echo json_encode($data);

?>