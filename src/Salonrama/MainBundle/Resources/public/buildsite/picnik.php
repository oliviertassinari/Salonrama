<?php

$Rt = '';
$LocFileHome = '../';

require_once($LocFileHome.'php/GFileDos.php');

if(isset($_POST['file'], $_POST['LocHomeImg']))
{
	$UrlImage = $_POST['file'];
	$LocFileImg = $LocFileHome.$_POST['LocHomeImg'];
	$Extension = getExtension($LocFileImg);

	if(stripos($UrlImage, 'http://www.picnik.com/') === 0 && $Extension == 'jpg')
	{
		if(is_file($LocFileImg))
		{
			$Data = file_get_contents($UrlImage);

			if($Data === false){
				$Rt = '"désolé le chargement de l\'image a échouer"';
			}
			else{
				file_put_contents($LocFileImg, $Data);

				$Size = getimagesize($LocFileImg);
				$Rt = '[0,"'.$Size[0].'","'.$Size[1].'"]';
			}
		}
		else{
			$Rt = '"Page dépasser"';
		}
	}
	else{
		$Rt = '"Url invalide"';
	}
}
else{
	$Rt = '"Requete incomplete"';
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>API Picnik</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

<script>

function Initi()
{
	window.parent.CadImage.Picnik.close('<?php echo $Rt; ?>');
}
	
</script>

</head>
<body onload="Initi()">
<?php echo $Rt; ?>
</body>
</html>