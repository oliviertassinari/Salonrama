<?php

$ModuleId = trim(htmlspecialchars($_GET['id']));

?>
<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="utf-8">

	<title>Google Maps Module</title>

	<script src="http://maps.google.com/maps/api/js?sensor=false&language=fr"></script>
	<script src="googlemap.js"></script>

	<link rel="stylesheet" href="map.css"/>
	<link rel="stylesheet" href="../../block.css"/>

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