<?php

require("db.php");

$q=mysqli_query($con,"SELECT * FROM `oc_banner_image` where banner_id='7'");


$data=array();
while ($row=mysqli_fetch_object($q)){
 $data[]=$row;
}

echo json_encode($data);
?>