<?php

namespace Salonrama\MainBundle;

class Subdomain
{
	public static function isValid($subdomain)
	{
		$length = strlen($subdomain);

		if(3 <= $length && $length <= 63)
		{
			if(preg_match("#^[a-z0-9]{1}[a-z0-9-]*[a-z0-9]{1}$#", $subdomain)) //Les caractères autorisés sont les lettres minuscules (a-z), les nombres (0-9) et le tiret (-).  Le tiret ne peuve se trouver en première ni en dernière position.
			{
				$state = array('state' => 0, 'text' => 'Ok');
			}
			else{
				$state = array('state' => 1, 'text' => 'Caractères invalides [0-9] [a-z] et [-].');
			}
		}
		else{
			$state = array('state' => 1, 'text' => 'Doit comporter entre 3 et 63 caractères.');
		}

		return $state;
	}

	public static function isAvailableSite($subdomain)
	{
		$state = self::isValid($subdomain);

		if($state['state'] == 0)
		{
			if(!is_dir('site/subdomain/'.$subdomain.'/'))
			{
				$state = array('state' => 0, 'text' => 'Ok');
				//$state = selft::isAvailable($subdomain);
			}
			else
			{
				$state = array('state' => 1, 'text' => 'Nom deja utilisé.');
			}
		}

		return $state;
	}

	public static function addSousDomSite($subdomain, $Num)
	{
		global $LocFileHome;
		
		require_once($LocFileHome.'php/GFileDos.php');

		$R = '';
		$subdomain = str_replace('/', '', $subdomain);
		$Num = str_replace('/', '', $Num);
		$Loc = $LocFileHome.'site/sous_dom/'.$subdomain.'/';

		if(!is_dir($Loc))
		{
			if(mkdir($Loc, 0777))
			{
				$Txt = '<?php

	$Num = "'.$Num.'";

	include("../sous_dom.php");

	?>';

				addFile($Txt, $Loc.'index.php');

				$R = true;
			}
			else
			{
				$R = 'Ajout impossible';
			}
		}
		else
		{
			$R = 'Ajout impossible';
		}

		return $R;
	}

	public static function removeSousDomSite($subdomain)
	{
		global $LocFileHome;
		
		require_once($LocFileHome.'php/GFileDos.php');

		$subdomain = str_replace('/', '', $subdomain);

		removeDos($LocFileHome.'site/sous_dom/'.$subdomain.'/');
	}

	public static function getSousDomList()
	{
		$R = '';

		try
		{
			$client = new SoapClient('https://api.dinhosting.fr/api.wsdl', array('trace' => 1, 'soap_version' => SOAP_1_1));
			$session = $client->login('TP1-DIN', 'tassiforever');

			if($session == false){
				$R = 'API indisponible';
			}

			$subdomainaines = $client->mutualiseSousDomaineListe($session, 'salonrama', 'salonrama.fr');

			if($subdomainaines != false){ //OK
				$R = $subdomainaines;
			}
			else{
				$R = 'Liste indisponible';
			}

			$logout = $client->logout($session);
		}
		catch(SoapFault $fault)
		{
			$R = $fault;
		}

		return $R;
	}

	public static $subdomainList = '';

	public static function isAvailable($subdomain)
	{
		global $subdomainList;

		if($subdomainList == '')
		{
			$subdomainList = getSousDomList();
		}

		$R = '';

		if(is_array($subdomainList))
		{
			if(in_array($subdomain, $subdomainList)){
				$R = 'Nom deja utilisé';
			}
			else{ //OK
				$R = true;
			}
		}
		else{
			$R = $subdomainList;
		}

		return $R;
	}

	public static function addSousDom($subdomain, $Chemin)
	{
		$R = '';

		try
		{
			$client = new SoapClient('https://api.dinhosting.fr/api.wsdl', array('trace' => 1, 'soap_version' => SOAP_1_1));
			$session = $client->login('TP1-DIN', 'tassiforever');

			if($session == false){
				$R = 'API indisponible';
			}

			$subdomainaine = $client->mutualiseSousDomaineAjouter($session, 'salonrama', 'salonrama.fr', $subdomain, 'www/'.$Chemin);

			if($subdomainaine == true){ //OK
				$R = true;
			}
			else{
				$R = 'Ajout impossible';
			}

			$logout = $client->logout($session);
		}
		catch(SoapFault $fault)
		{
			$R = $fault;
		}

		return $R;
	}

	public static function removeSousDom($subdomain)
	{
		$R = '';

		try
		{
			$client = new SoapClient('https://api.dinhosting.fr/api.wsdl', array('trace' => 1, 'soap_version' => SOAP_1_1));
			$session = $client->login('TP1-DIN', 'tassiforever');

			if($session == false){
				$R = 'API indisponible';
			}

			$subdomainaine = $client->mutualiseSousDomaineRetirer($session, 'salonrama', 'salonrama.fr', $subdomain);

			if($subdomainaine == true){ //OK
				$R = true;
			}
			else{
				$R = 'Suppression impossible';
			}

			$logout = $client->logout($session);
		}
		catch(SoapFault $fault)
		{
			$R = $fault;
		}

		return $R;
	}
}

?>