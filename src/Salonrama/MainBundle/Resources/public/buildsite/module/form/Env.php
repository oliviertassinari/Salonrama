<?php

function getIP()
{
	return $_SERVER['REMOTE_ADDR'];
}

function getIPInfo($IP)
{
	$Data = file_get_contents('http://www.ipinfodb.com/ip_query.php?ip='.$IP.'&output=json');
 
	if(!$Data)
	{
		$Data = file_get_contents('http://backup.ipinfodb.com/ip_query.php?ip='.$IP.'&output=json');
	}

	if($Data)
	{
		$Data = json_decode($Data, true);

		return array(
			'IP' => $Data['Ip'],
			'PaysCode' => $Data['CountryCode'],
			'PaysNom' => $Data['CountryName'],
			'RegionNom' => $Data['RegionName'],
			'Ville' => $Data['City'],
			'CodePostal' => $Data['ZipPostalCode'],
			'Latitude' => $Data['Latitude'],
			'Longitude' => $Data['Longitude']
		);
	}
	else
	{
		return array();
	}
}

function getHost()
{
	return gethostbyaddr($_SERVER['REMOTE_ADDR']);
}

function getStrLeft($s1, $s2)
{
	return substr($s1, 0, strpos($s1, $s2));
}

function getStrRight($s1, $s2)
{
	$pos = strrpos($s1, $s2);
	return substr($s1, $pos+1,  strlen($s1)-$pos);
}

function getBeforeRequestUri()
{
	$Ssl = empty($_SERVER['HTTPS']) ? '' : ($_SERVER['HTTPS'] == 'on') ? 's' : '';
	$Protocol = getStrLeft(strtolower($_SERVER['SERVER_PROTOCOL']), '/'). $Ssl;
	$Port = ($_SERVER['SERVER_PORT'] == '80') ? '' : (':'.$_SERVER['SERVER_PORT']);

	return $Protocol.'://'.$_SERVER['SERVER_NAME'].$Port;
}

function getRequestUri($getGETParametre = false)
{
	$requestUri = $_SERVER['REQUEST_URI'];

	if($getGETParametre === false)
	{
		$pos = strrpos($requestUri, '?');

		if($pos !== false){
			$requestUri = substr($requestUri, 0, $pos);
		}
	}

	if(getStrRight($requestUri, '/') == ''){
		$requestUri .= 'index.php';
	}

	return $requestUri;
}

?>