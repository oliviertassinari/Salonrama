<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class Step5Controller extends Controller
{
    public function step5Action()
    {
        return $this->render('SalonramaMainBundle:Buildsite:step5.html.twig');
    }
}

?>