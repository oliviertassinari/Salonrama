<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PresentationController extends Controller
{
    public function presentationAction()
    {
        return $this->render('SalonramaMainBundle:Main:presentation.html.twig');
    }
}

?>