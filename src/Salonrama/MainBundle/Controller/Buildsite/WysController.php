<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class WysController extends Controller
{
    public function wysAction()
    {
    	return $this->render('SalonramaMainBundle:Buildsite:wys.html.twig');
    }
}

?>