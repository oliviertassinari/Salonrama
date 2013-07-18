<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class HelpController extends Controller
{
    public function helpAction()
    {
        return $this->render('SalonramaMainBundle:Main:help.html.twig');
    }
}

?>