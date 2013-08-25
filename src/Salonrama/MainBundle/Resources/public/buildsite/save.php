<?php

$LocFileHome = '../';
session_start();

require_once($LocFileHome.'php/buildAjaxReturn.php');

if(isset($_POST['save']))
{
	$i = 0;

	while(isset($_POST['Nom'.$i], $_POST['Var'.$i]))
	{
		$_SESSION['Site'][$_POST['Nom'.$i]] = $_POST['Var'.$i];
		$i++;
	}

	buildAjaxReturn(0, 'Ok.');
}
else
{
	buildAjaxReturn(1, 'Requette invalide.');
}

?>