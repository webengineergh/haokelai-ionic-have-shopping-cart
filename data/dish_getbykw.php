<?php
	//�޸���Ӧͷ��ʽjson
	header("content-type:application/json,charset=utf-8");
	//2.�������ݿ����� ���ñ���
	require("init.php");
	//3.1��ȡ�û��ύ�Ĳ���
	//3.2 �����ѯƫ����
	@$kw=$_REQUEST['kw'];
	if(empty($kw)){
	echo "[]";
	return;
	}
	//3.����sql ����sql
	$sql="SELECT did,name,img_sm,material,price FROM kf_dish WHERE material LIKE '%$kw%' OR name LIKE '%$kw%'";
	//4.ץȡ���м�¼
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