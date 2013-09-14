<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class GetThemeController extends Controller
{
    public function getThemeAction()
    {
		$state = array('state' => 1, 'text' => 'Champ Invalide.');
		return new JsonResponse($state);
    }
}

?>