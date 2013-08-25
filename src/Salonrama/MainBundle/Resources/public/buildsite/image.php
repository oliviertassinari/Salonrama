<?php

$LocFileHome = '../';
session_start();

$ExtensionImage = array('jpg', 'jpeg', 'jpe', 'gif', 'png');
$SizeMax = array('10Mo', 1048576*10); // MegaOcte

if(isset($_POST['LocHomeSite']))
{
	$LocHomeSite = $_POST['LocHomeSite'];
	$LocFileSite = $LocFileHome.$LocHomeSite;
	$LocFileImg = $LocFileSite.'upload/';
}
else if(isset($_SESSION['Site']))
{
	$LocHomeSite = $_SESSION['Site']['LocHomeSite'];
	$LocFileSite = $LocFileHome.$LocHomeSite;
	$LocFileImg = $LocFileSite.'upload/';
}

require_once($LocFileHome.'php/buildAjaxReturn.php');

if(isset($LocFileSite))
{
	if(is_dir($LocFileSite))
	{
		require_once($LocFileHome.'php/GFileDos.php');

		if(isset($_FILES['addUploadFile']))
		{
			addUploadFile($_FILES['addUploadFile']);
		}
		else if(isset($_POST['addUrl']))
		{
			addUrl($_POST['addUrl']);
		}
		else if(isset($_POST['addBdd']))
		{
			addBdd($_POST['addBdd']);
		}
		else if(isset($_POST['remove']))
		{
			remove($_POST['remove']);
		}
		else{
			buildAjaxReturn(1, 'Requete invalide.');
		}
	}
	else
	{
		buildAjaxReturn(1, 'Repertoir du site introuvable.');
	}
}
else
{
	buildAjaxReturn(1, 'destination introuvable.');
}

function addUploadFile($File)
{
	global $LocFileImg;
	global $ExtensionImage;
	global $SizeMax;

	if($File['error'] == 0)
	{
		if($File['size'] < $SizeMax[1]) // Octet
		{
			if($File['size'] > 0)
			{
				$Extension = getExtension($File['name']);

				if(in_array($Extension, $ExtensionImage))
				{
					$Nom = GenId();
					$Loc = $LocFileImg.$Nom.'.'.$Extension;;

					if(@move_uploaded_file($File['tmp_name'], $Loc))
					{
						$Size = resizeImage($Loc);

						buildAjaxReturn(0, array($Nom.'.jpg', $Size[0], $Size[1]));
					}
					else{ buildAjaxReturn(1, 'Traitement impossible.'); }
				}
				else{ buildAjaxReturn(1, 'Extension invalide (.'.$Extension.')'); }
			}
			else{ buildAjaxReturn(1, 'Image introuvable.'); }
		}
		else{ buildAjaxReturn(1, 'Taille limité à '.$SizeMax[0].')'); }
	}
	else{ buildAjaxReturn(1, 'Erreur (PHP_'.$File['error'].')'); }
}

function addUrl($Url)
{
	global $LocFileImg;
	global $ExtensionImage;
	global $SizeMax;

	if(preg_match('#^(http:\/\/)?([\w\-\.]+)\:?([0-9]*)\/(.*)$#', $Url, $url_ary) && !empty($url_ary[4]))
	{
		$Extension = getExtension($url_ary[4]);

		if(!empty($Extension))
		{
			if(in_array($Extension, $ExtensionImage))
			{
				$port = (!empty($url_ary[3])) ? $url_ary[3] : 80;

				if(@($fsock = fsockopen($url_ary[2], $port, $errno, $errstr)))
				{
					fputs($fsock, "GET /".$url_ary[4]." HTTP/1.1\r\n");
					fputs($fsock, "Host: ".$url_ary[2]."\r\n");
					fputs($fsock, "Accept-Language: fr\r\n");
					fputs($fsock, "Accept-Encoding: none\r\n");
					fputs($fsock, "User-Agent: PHP\r\n");
					fputs($fsock, "Connection: close\r\n\r\n");

					$data = '';
					while(!feof($fsock))
					{
						$data .= fread($fsock, $SizeMax[1]);
					}
					fclose($fsock);

					if(preg_match('(200 OK)', $data))
					{
						if(preg_match('#Content-Length\: ([0-9]+)[^ /][\s]+#i', $data, $Size) && preg_match('#Content-Type\: image/[x\-]*([a-z]+)[\s]+#i', $data, $Extension))
						{
							$Size = $Size[1]; //Octet
							$Extension = $Extension[1]; 

							if($Size > 0)
							{
								if($Size < $SizeMax[1])
								{
									if(in_array($Extension, $ExtensionImage))
									{
										$data = substr($data, strlen($data) - $Size, $Size);

										$Nom = GenId();
										$Loc = $LocFileImg.$Nom.'.'.$Extension;

										if(@addFile($data, $Loc))
										{
											$Size = resizeImage($Loc);

											buildAjaxReturn(0, array($Nom.'.jpg', $Size[0], $Size[1]));
										}
										else{ buildAjaxReturn(1, 'Erreur de deplacement.'); }
									}
									else{ buildAjaxReturn(1, 'Extension invalide (.'.$Extension.')'); }
								}
								else{ buildAjaxReturn(1, 'Taille limité a '.$SizeMax[0]); }
							}
							else{ buildAjaxReturn(1, 'Aucune donnée.'); }
						}
						else{ buildAjaxReturn(1, 'Aucune donnée.'); }
					}
					else{ buildAjaxReturn(1, 'Image introuvable.'); }
				}
				else{ buildAjaxReturn(1, 'Connextion impossible.'); }
			}
			else{ buildAjaxReturn(1, 'Extension invalide (.'.$Extension.')'); }
		}
		else{ buildAjaxReturn(1, 'Aucune extension.'); }
	}
	else{ buildAjaxReturn(1, 'Adresse invalide.'); }
}

function addBdd($Nom)
{
	global $LocFileHome;
	global $LocFileImg;

	$Nom = str_replace('/', '', $Nom); //Anti-HAck
	$LocBddImg = $LocFileHome.'site/bdd_img/'.$Nom;
	$NewNom = GenId().'.jpg';

	if(is_file($LocBddImg))
	{
		if(copyFile($LocBddImg, $LocFileImg.$NewNom))
		{
			buildAjaxReturn(0, $NewNom);
		}
		else{
			buildAjaxReturn(1, 'Echec de la copie de l\image.');
		}
	}
	else{
		buildAjaxReturn(1, 'Impossible de trouver l\'image.');
	}
}

function GenId()
{
	srand((double)microtime()*1000000);
	return time().rand(0, 100000);
}

function resizeImage($Loc)
{
	$Extension = getExtension($Loc);
	$NewSrc = substr($Loc, 0, strrpos($Loc, '.')).'.jpg';

	$size = getimagesize($Loc);
	$src_w = $size[0]; 
	$src_h = $size[1];
	$dst_w = 640;
	$dst_h = 480;

	if($src_w < $dst_w && $src_h < $dst_h) // Taille correcte
	{
		if($Extension != 'jpg')
		{
			$Img = getImg($Extension, $Loc);

			imagejpeg($Img, $NewSrc);
			removeFile($Loc);
		}

		return array($src_w, $src_h);
	}
	else // Redimentionnage
	{
		$test_h = round(($dst_w / $src_w) * $src_h);
		$test_w = round(($dst_h / $src_h) * $src_w);

		if($test_h > $dst_h){ 
			$dst_w = $test_w; 
		}
		else{
			$dst_h = $test_h; 
		}

		$Img = getImg($Extension, $Loc);
		$NewImg = imagecreatetruecolor($dst_w, $dst_h);

		imagecopyresampled($NewImg, $Img, 0, 0, 0, 0, $dst_w, $dst_h, $src_w, $src_h);
		imagejpeg($NewImg, $NewSrc);

		if($Extension != 'jpg'){
			removeFile($Loc);
		}

		return array($dst_w, $dst_h);
	}
}

function getImg($Extension, $Loc)
{
	if(in_array($Extension, array('jpg', 'jpeg', 'jpe'))){
		return imagecreatefromjpeg($Loc);
	}
	else if($Extension == 'png'){
		return imagecreatefrompng($Loc);
	}
	else if($Extension == 'gif'){
		return imagecreatefromgif($Loc);
	}
}

function remove($Nom)
{
	global $LocFileImg;

	$Nom = str_replace('/', '', $Nom); //Anti-HAck

	if(removeFile($LocFileImg.$Nom))
	{
		buildAjaxReturn(0, 'Image supprimé.');
	}
	else
	{
		buildAjaxReturn(1, 'Echec de la supression.');
	}
}

?>