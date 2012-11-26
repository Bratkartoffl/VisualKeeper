<?php
	$uname = $_GET['uname'];
	$uid = $_GET['uid'];
	$taskid = $_GET['tid'];
	$photoid = $_GET['pid'];
	$path = '../user_images/'.$uname.$uid;
	echo 'path = '.$path;
	//print_r($_FILES);
	//might need absolute path
	move_uploaded_file($_FILES["file"]["tmp_name"], $path.$taskid.$photoid);

?>