<?php
	//�޸���Ӧͷ��ʽjson
	header("content-type:application/json,charset=utf-8");
	//2.�������ݿ����� ���ñ���
	require("init.php");
	//3.1��ȡ�û��ύ�Ĳ���
	//3.2 �����ѯƫ����
	@$phone=$_REQUEST['phone'];
	if(empty($phone)){
    	echo "[]";
    	return;
    	}
	//3.����sql ����sql
	$sql="SELECT kf_order.oid,kf_dish.did,kf_dish.img_sm,kf_order.order_time,kf_order.user_name FROM kf_order,kf_dish WHERE kf_order.did=kf_dish.did AND kf_order.phone='$phone'";
	//4.ץȡ���м�¼
	$result=mysqli_query($conn,$sql);
	$output=[];
	$rows=mysqli_fetch_assoc($result);
	 $output[]=$rows;
    echo json_encode($output);
?>