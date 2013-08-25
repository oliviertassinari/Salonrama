<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class BuildsiteController extends Controller
{
    public function buildsiteAction()
    {
        return $this->render('SalonramaMainBundle:Main:buildsite.html.twig');
    }
}

?>