<?php
	//�޸���Ӧͷ��ʽjson
	header("content-type:application/json,charset=utf-8");
	//2.�������ݿ����� ���ñ���
	require("init.php");
	//3.1��ȡ�û��ύ�Ĳ���
	//3.2 �����ѯƫ����
	@$id=$_REQUEST['id'];
	if(empty($id)){
    	echo "[]";
    	return;
    	}

	//3.����sql ����sql
	$sql="SELECT did,name,img_lg,material,detail,price FROM kf_dish WHERE did=$id";
	//4.ץȡ���м�¼
	$result=mysqli_query($conn,$sql);
	$row=mysqli_fetch_assoc($result);
	 $output=[];
	 $output[]=$row;
    echo json_encode($output);
?>