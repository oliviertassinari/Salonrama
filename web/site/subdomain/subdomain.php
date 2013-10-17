<?php

if(isset($_GET['page'])){
	$Page = $_GET['page'];
	$_GET['page'] = '';
}
else{
	$Page = 'index.php';
}

$Page = str_replace('../', '', $Page);
$Num = str_replace('/', '', $Num);
$Extension = strtolower(substr(strrchr($Page, '.'), 1));

if($Extension == 'jpg')
{
	header('Content-type: image/jpeg');
}

if(!@include('../../online/'.$Num.'/'.$Page))
{
	header("location:http://www.salonrama.fr/erreur.php?erreur=404");
}

?>