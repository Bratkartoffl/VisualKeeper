<?php
	$id=$_GET['id'];
	$uname=$_GET['uname'];
	$path = '../user_images/'.$uname.$id;
	echo $path;
	if (!mkdir($path)) {
    	die('Failed to create folders...');
	}
	

?>