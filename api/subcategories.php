<?php

require("db.php");

$_POST = json_decode(file_get_contents('php://input'), true);
$category_id=$_POST['category_id'];

$q=mysqli_query($con,"select category_id from `oc_category` where parent_id='$category_id'");

$data=array();
while ($row=mysqli_fetch_array($q)){
 $data[]=$row;
}


$lastElement = end($data);
echo "[";
foreach ($data as $category) {
	$c_id=$category['category_id'];
	$q=mysqli_query($con,"select category_id,name from `oc_category_description` where category_id='$c_id'");

	$row=mysqli_fetch_object($q);
 	$d=$row;
 	
	echo json_encode($d);

	 if($category!= $lastElement) {
	 	echo ",";
	 }
}

echo "]";
?>