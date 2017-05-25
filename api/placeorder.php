<?php

require("db.php");


$_POST = json_decode(file_get_contents('php://input'), true);

$invoice_no="0";
$invoice_prefix="I";
$store_id=0;
$store_name='FYNkart | Online grocery in Ranchi';
$store_url='http://fynkart.com';
$customer_id=(int)$_POST['customer_id'];
$customer_group_id=1;
$firstname=$_POST['firstname'];
$lastname=$_POST['lastname'];
$email=$_POST['email'];
$telephone=$_POST['telephone'];

/*$payment_firstname=$_POST['firstname'];
$payment_lastname=$_POST['lastname'];*/

$address_1=$_POST['address_1'];
$address_2=$_POST['address_2'];
$city=$_POST['city'];
$postcode=$_POST['postcode'];
$country="India";
$country_id=99;
$zone="Jharkhand";
$method="Cash on Delivery";
$code="cod";

/*$shipping_firstname=$_POST['firstname'];
$shipping_lastname=$_POST['lastname'];
$shipping_address_1=$_POST['address_1'];
$shipping_address_2=$_POST['address_2'];*/
/*$shipping_city=$_POST['city'];
$shipping_postcode=$_POST['postcode'];*/
/*$shipping_country="India";
$shipping_country_id="99";
$shipping_zone="Jharkhand";*/

$shipping_method="Flat Shipping Rate";
$shipping_code="flat.flat";
$total=$_POST['total'];
$order_status_id=1;
$affiliate_id=0;
$commission=0;
$marketing_id=0;
$language_id=1;
$currency_id=4;
$currency_code="RUP";
$currency_value=1;
$shipping=$_POST['shipping'];
$date_added=$_POST['date_added'];


echo $customer_id;
echo $firstname;
echo $lastname;
echo $email;
echo $telephone;
echo $address_1;
echo $address_2;
echo $city;
echo $postcode;
echo $total;
echo $shipping;
echo $date_added;


$str="INSERT INTO `oc_order`(invoice_no,invoice_prefix,store_id,store_name,store_url,customer_id,customer_group_id,firstname,lastname,email,telephone,payment_firstname,payment_lastname,payment_address_1,payment_address_2,payment_city,payment_postcode,payment_country,payment_country_id,payment_zone,payment_method,payment_code,shipping_firstname,shipping_lastname,shipping_address_1,shipping_address_2,shipping_city,shipping_postcode,shipping_country,shipping_country_id,shipping_zone,shipping_method,shipping_code,total,order_status_id,affiliate_id,commission,marketing_id,language_id,currency_id,currency_code,currency_value,date_added) VALUES ('$invoice_no','$invoice_prefix','$store_id','$store_name','$store_url','$customer_id','$customer_group_id','$firstname','$lastname','$email','$telephone','$firstname','$lastname','$address_1','$address_2','$city','$postcode','$country','$country_id','$zone','$method','$code','$firstname','$lastname','$address_1','$address_2','$city','$postcode','$country','$country_id','$zone','$shipping_method','$shipping_code','$total','$order_status_id','$affiliate_id','$commission','$marketing_id','$language_id','$currency_id','$currency_code','$currency_value','$date_added')";



$q=mysqli_query($con,$str);


$q=mysqli_query($con,"SELECT order_id FROM `oc_order` ORDER BY order_id  DESC");
$data=mysqli_fetch_array($q);
$order_id=$data['order_id'];

$products=$_POST['cart'];
foreach ($products as $product) {
	$product_id=$product['product_id'];
	$name=$product['name'];
	$quantity=$product['quantity'];
	$price=$product['dprice'];
	$product_total=$product['dprice']*$quantity;

	$q=mysqli_query($con,"INSERT INTO `oc_order_product` (order_id,product_id,name,quantity,price,total) VALUES('$order_id','$product_id','$name','$quantity','$price','$product_total')");

}

$q=mysqli_query($con,"INSERT  INTO `oc_order_history` (order_id) VALUES ('$order_id')");



$q=mysqli_query($con,"INSERT  INTO `oc_order_total` (order_id,code,title,value) VALUES ('$order_id','sub-total','Sub-Total','$total')");


$q=mysqli_query($con,"INSERT  INTO `oc_order_total` (order_id,code,title,value) VALUES ('$order_id','shipping','Flat Shipping Rate','$shipping')");


$total_payable=$total+$shipping;
$q=mysqli_query($con,"INSERT  INTO `oc_order_total` (order_id,code,title,value) VALUES ('$order_id','total','Total','$total_payable')");


?>