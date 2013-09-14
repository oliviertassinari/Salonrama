<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class SaveController extends Controller
{
    public function saveAction()
    {
		$request = $this->getRequest();
		$session = $request->getSession();
		$state = array('state' => 1, 'text' => 'Requête invalide.');

		if($request->isXmlHttpRequest())
		{
			$i = 0;

			while(isset($_POST['Nom'.$i], $_POST['Var'.$i]))
			{
				$session->set('buildsite/site/'.$_POST['Nom'.$i], $_POST['Var'.$i]);
				$i++;
			}

			$state = array('state' => 0, 'text' => 'Ok.');
		}

		return new JsonResponse($state);
    }
}

?>