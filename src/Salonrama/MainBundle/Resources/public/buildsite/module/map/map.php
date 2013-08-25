<?php

$ModuleId = trim(htmlspecialchars($_GET['id']));

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Google Maps Module</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

	<script src="http://maps.google.com/maps/api/js?sensor=false&language=fr"></script>
	<script src="googlemap.js"></script>

	<link rel="stylesheet" href="map.css"/>
	<link rel="stylesheet" href="/css/form.css"/>
	<link rel="stylesheet" href="/creator/block.css"/>

<style>

html, body{
margin:0;
padding:0;
height:100%;
width:100%;
}

</style>

<script>

function Initi()
{
	window.parent.GModule.List['<?php echo $ModuleId; ?>'].load();
}

</script>

</head>
<body onload="Initi()">

<div id="Map" class="BlockWHFull"></div>

</body>
</html>