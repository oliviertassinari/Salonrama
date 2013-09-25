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

			while($request->request->has('Nom'.$i) && $request->request->has('Var'.$i))
			{
				$session->set('buildsite/site/'.$request->request->get('Nom'.$i), $request->request->get('Var'.$i));
				$i++;
			}

			$state = array('state' => 0, 'text' => 'Ok.');
		}

		return new JsonResponse($state);
    }
}

?>