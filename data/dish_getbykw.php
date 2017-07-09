<?php
	//修改响应头格式json
	header("content-type:application/json,charset=utf-8");
	//2.创建数据库连接 设置编码
	require("init.php");
	//3.1获取用户提交的参数
	//3.2 计算查询偏移量
	@$kw=$_REQUEST['kw'];
	if(empty($kw)){
	echo "[]";
	return;
	}
	//3.创建sql 发送sql
	$sql="SELECT did,name,img_sm,material,price FROM kf_dish WHERE material LIKE '%$kw%' OR name LIKE '%$kw%'";
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