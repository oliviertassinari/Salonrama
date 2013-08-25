<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class Step2Controller extends Controller
{
    public function step2Action()
    {
        return $this->render('SalonramaMainBundle:Buildsite:step2.html.twig');
    }
}

?>