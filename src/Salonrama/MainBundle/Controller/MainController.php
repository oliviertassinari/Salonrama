<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class MainController extends Controller
{
    public function indexAction()
    {
        return $this->render('SalonramaMainBundle:Main:index.html.twig');
    }

    public function contactAction()
    {
        return $this->render('SalonramaMainBundle:Main:contact.html.twig');
    }

    public function presseAction()
    {
        return $this->render('SalonramaMainBundle:Main:presse.html.twig');
    }

    public function aproposAction()
    {
        return $this->render('SalonramaMainBundle:Main:apropos.html.twig');
    }

    public function mentionLegaleAction()
    {
        return $this->render('SalonramaMainBundle:Main:mention-legale.html.twig');
    }
}
