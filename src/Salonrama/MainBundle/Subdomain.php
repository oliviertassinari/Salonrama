<?php

namespace Salonrama\MainBundle;

use Doctrine\Bundle\DoctrineBundle\Registry as Doctrine;
use Salonrama\MainBundle\File;
use SoapClient;

class Subdomain
{
	private $em;

	public function __construct(Doctrine $doctrine)
	{
		$this->em = $doctrine->getManager();
	}

	public function isValid($subdomain)
	{
		$length = strlen($subdomain);

		if(3 <= $length && $length <= 63)
		{
			if(preg_match("#^[a-z0-9]{1}[a-z0-9-]*[a-z0-9]{1}$#", $subdomain)) //Les caractères autorisés sont les lettres minuscules (a-z), les nombres (0-9) et le tiret (-).  Le tiret ne peuve se trouver en première ni en dernière position.
			{
				$state = array('state' => 0, 'text' => 'Ok.');
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

	public function isAvailableSite($subdomain)
	{
		$state = $this->isValid($subdomain);

		if($state['state'] == 0)
		{
			$siteRepository = $this->em->getRepository('SalonramaMainBundle:Site');
			$findSubdomain = $siteRepository->findOneBySubdomain($subdomain);

			if(!$findSubdomain)
			{
				$state = $this->isAvailable($subdomain);
			}
			else
			{
				$state = array('state' => 1, 'text' => 'Nom deja utilisé.');
			}
		}

		return $state;
	}

	public function getList()
	{
		$state = array('state' => 1, 'text' => "Erreur avec l'API.");

		if(class_exists('SoapClient'))
		{
			try
			{
				$client = new SoapClient('https://api.dinhosting.fr/api.wsdl', array('trace' => 1, 'soap_version' => SOAP_1_1));
				$session = $client->login('TP1-DIN', 'tassiforever');

				if($session == false){
					$state = array('state' => 1, 'text' => 'API indisponible.');
				}

				$subdomainaines = $client->mutualiseSousDomaineListe($session, 'salonrama', 'salonrama.fr');

				if($subdomainaines != false){ //OK
					$state = $subdomainaines;
				}
				else{
					$state = array('state' => 1, 'text' => 'Liste indisponible.');
				}

				$logout = $client->logout($session);
			}
			catch(SoapFault $fault)
			{
				$state = array('state' => 1, 'text' => $fault);
			}
		}
		else
		{
			$state = array(); //Localhost
		}

		return $state;
	}

	private $list;

	public function isAvailable($subdomain)
	{
		if($this->checkList($this->list) == false)
		{
			$this->list = $this->getList();
		}

		if(is_array($this->list) && $this->checkList($this->list))
		{
			if(in_array($subdomain, $this->list))
			{
				$state = array('state' => 1, 'text' => 'Nom deja utilisé.');
			}
			else
			{
				$state = array('state' => 0, 'text' => 'Ok.');
			}
		}
		else{
			$state = $this->list;
		}

		return $state;
	}

	public function checkList($list)
	{
		if(is_array($this->list))
		{
			if(isset($this->list['state']))
			{
				return false;
			}
		}
		else
		{
			return false;
		}

		return true;
	}

	public function addSite($subdomain, $id)
	{
		$state = $this->isValid($subdomain);

		if($state['state'] == 0)
		{
			$path = 'site/subdomain/'.$subdomain.'/';
			$state = array('state' => 1, 'text' => 'Erreur.');

			if(!is_dir($path))
			{
				if(mkdir($path, 0777))
				{
					$text = ''.
'<?php

	$Num = "'.$id.'";

	include("../sous_dom.php");

?>';

					File::addFile($text, $path.'index.php');

					$state = array('state' => 0, 'text' => 'Ok.');
				}
			}
		}

		return $state;
	}

	public function removeSite($subdomain)
	{
		$subdomain = str_replace('/', '', $subdomain);

		File::removeFolder('site/subdomain/'.$subdomain.'/');
	}
}

?>