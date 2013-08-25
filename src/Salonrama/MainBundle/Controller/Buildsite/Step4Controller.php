<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class Step4Controller extends Controller
{
    public function step4Action()
    {
        return $this->render('SalonramaMainBundle:Buildsite:step4.html.twig');
    }
}

?>