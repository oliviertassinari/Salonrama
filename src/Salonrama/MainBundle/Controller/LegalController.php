<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class LegalController extends Controller
{
    public function legalAction()
    {
        return $this->render('SalonramaMainBundle:Main:legal.html.twig');
    }
}

?>