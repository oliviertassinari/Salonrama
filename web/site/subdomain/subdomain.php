<?php

if(isset($_GET['page'])){
	$Page = $_GET['page'];
	$_GET['page'] = '';
}
else{
	$Page = 'index.php';
}

if($Page == 'app.php')
{
	$Page = 'index.php';
}

$Page = str_replace('../', '', $Page);
$Num = str_replace('/', '', $Num);

if(!@include('../../online/'.$Num.'/'.$Page))
{
	header("location:http://www.salonrama.fr/erreur.php?erreur=404");
}

?>