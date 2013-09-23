<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Salonrama\MainBundle\Assembler;

class PreviewController extends Controller
{
    public function previewAction()
    {
		$request = $this->getRequest();
		$session = $request->getSession();
		$state = array('state' => 0, 'text' => 'Ok.');

		new Assembler(
			$session->get('buildsite/site/pathBack'),
			$session->get('buildsite/site/blockList'),
			$session->get('buildsite/site/dataList'),
			$session->get('buildsite/site/imageList'),
			$session->get('buildsite/site/theme'),
			$session->get('buildsite/site/pageList'),
			''
		);

		return new JsonResponse($state);
    }
}

?>