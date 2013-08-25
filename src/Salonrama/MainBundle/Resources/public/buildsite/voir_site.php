<?php

$LocFileHome = '../';
session_start();

require_once($LocFileHome.'php/buildAjaxReturn.php');
require_once($LocFileHome.'site/assembler.php');

new assembler(
	$LocFileHome,
	$_SESSION['Site']['LocHomeSite'],
	$_SESSION['Site']['BlockList'],
	$_SESSION['Site']['DataList'],
	$_SESSION['Site']['ImageList'],
	$_SESSION['Site']['Theme'],
	$_SESSION['Site']['PageList'],
	''
);

buildAjaxReturn(0, 'Ok.');

?>