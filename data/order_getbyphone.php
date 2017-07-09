<?php
	//修改响应头格式json
	header("content-type:application/json,charset=utf-8");
	//2.创建数据库连接 设置编码
	require("init.php");
	//3.1获取用户提交的参数
	//3.2 计算查询偏移量
	@$phone=$_REQUEST['phone'];
	if(empty($phone)){
    	echo "[]";
    	return;
    	}
	//3.创建sql 发送sql
	$sql="SELECT kf_order.oid,kf_dish.did,kf_dish.img_sm,kf_order.order_time,kf_order.user_name FROM kf_order,kf_dish WHERE kf_order.did=kf_dish.did AND kf_order.phone='$phone'";
	//4.抓取多行记录
	$result=mysqli_query($conn,$sql);
	$output=[];
	$rows=mysqli_fetch_assoc($result);
	 $output[]=$rows;
    echo json_encode($output);
?>