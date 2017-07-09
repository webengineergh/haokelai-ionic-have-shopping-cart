<?php
	//修改响应头格式json
	header("Content-Type:application/json,charset=utf-8");
	@$start=$_REQUEST['start'];
	require("init.php");
	if(empty($start)){
		$start=0;
	}
	//3.创建sql 发送sql
	$sql="SELECT did,name,img_sm,material,price FROM kf_dish LIMIT $start,5";
	//4.抓取多行记录
	$result=mysqli_query($conn,$sql);
	$output=[];
	while(true){
		$row=mysqli_fetch_assoc($result);
		if(!$row){
		break;
		}
		$output[]=$row;
	}
	echo json_encode($output);

?>