<?php

namespace Salonrama\MainBundle;

class Encrypter
{
	public static function getKey($data, $CleDEncryptage)
	{
		$CleDEncryptage = md5($CleDEncryptage);
		$Compteur = 0;
		$VariableTemp = '';

		for($Ctr = 0; $Ctr < strlen($data); $Ctr++)
		{
			if($Compteur == strlen($CleDEncryptage))
			{
				$Compteur = 0;
			}
			$VariableTemp .= substr($data,$Ctr,1) ^ substr($CleDEncryptage, $Compteur,1);
			$Compteur++;
		}

		return $VariableTemp;
	}

	public static function encode($data, $key = 'tassiforever')
	{
		srand((double)microtime()*1000000);
		$CleDEncryptage = md5(rand(0,32000));
		$Compteur = 0;
		$VariableTemp = "";

		for($Ctr = 0; $Ctr < strlen($data); $Ctr++)
		{
			if($Compteur == strlen($CleDEncryptage))
			$Compteur = 0;
			$VariableTemp .= substr($CleDEncryptage, $Compteur, 1).(substr($data, $Ctr, 1) ^ substr($CleDEncryptage, $Compteur,1));
			$Compteur++;
		}

		return base64_encode(Encrypter::getKey($VariableTemp, $key));
	}

	public static function decode($data, $key = 'tassiforever')
	{
		$data = Encrypter::getKey(base64_decode($data), $key);
		$VariableTemp = "";

		for($Ctr = 0; $Ctr < strlen($data); $Ctr++)
		{
			$md5 = substr($data, $Ctr, 1);
			$Ctr++;
			$VariableTemp .= (substr($data, $Ctr, 1) ^ $md5);
		}

		return $VariableTemp;
	}
}

?>