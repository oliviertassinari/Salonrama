<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class AboutController extends Controller
{
    public function aboutAction()
    {
        return $this->render('SalonramaMainBundle:Main:about.html.twig');
    }
}

?>