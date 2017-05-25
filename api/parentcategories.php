<?php

require("db.php");

$q=mysqli_query($con,"select category_id from `oc_category` where parent_id='0'");

$data=array();
while ($row=mysqli_fetch_array($q)){
 $data[]=$row;
}

$lastElement = end($data);
echo "[";
foreach ($data as $category) {
	$c_id=$category['category_id'];
	$q=mysqli_query($con,"select category_id,name from `oc_category_description` where category_id='$c_id'");

	$row=mysqli_fetch_array($q);
	$category_id=$row['category_id'];
	$name=$row['name'];
	$image=strtolower($name);
	$image='/category_images/'.str_replace(' ','',$image).'.jpg';

	echo '{"category_id":'.'"'.$category_id.'","name":'.'"'.$name.'","image":'.'"'.$image.'"}';
	 if($category!= $lastElement) {
	 	echo ",";
	 }
}

echo "]";
?>