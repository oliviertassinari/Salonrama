<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class ThemeController extends Controller
{
    public function getStructureAction()
    {
		$request = $this->getRequest();
		$state = array('state' => 1, 'text' => 'Requête invalide.');

		if($request->isXmlHttpRequest())
		{
			$theme = $request->request->get('theme');
			$theme = str_replace('/', '', $theme);
			require_once('../src/Salonrama/MainBundle/Resources/public/theme/'.$theme.'/theme.php');

			$Structure = eval('return '.$theme.'::$Structure;');
			$BlockListWidth = eval('return '.$theme.'::$BlockListWidth;');

			if($Structure && $BlockListWidth)
			{
				$Structure = preg_replace('/[\t\r\n]/sU', '', $Structure);

				$state = array('state' => 0, 'text' => array($BlockListWidth, $Structure));
			}
		}

		return new JsonResponse($state);
    }

    public function getInteAction()
    {
		$request = $this->getRequest();
		$state = array('state' => 1, 'text' => 'Requête invalide.');

		if($request->isXmlHttpRequest())
		{
			$theme = $request->request->get('theme');
			$theme = str_replace('/', '', $theme);
			require_once('../src/Salonrama/MainBundle/Resources/public/theme/'.$theme.'/theme.php');

			$inte = json_decode($request->request->get('inte'), true);

			$InteList = array();

			foreach($inte as $i)
			{
				$InteList[$i] = eval('return '.$theme.'::getInteHtml($i);');
			}

			$state = array('state' => 0, 'text' => $InteList);
		}

		return new JsonResponse($state);
    }
}

?>