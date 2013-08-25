<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class Step3Controller extends Controller
{
    public function step3Action()
    {
        return $this->render('SalonramaMainBundle:Buildsite:step3.html.twig');
    }
}

?>