<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PresseController extends Controller
{
    public function presseAction()
    {
        return $this->render('SalonramaMainBundle:Main:presse.html.twig');
    }
}

?>