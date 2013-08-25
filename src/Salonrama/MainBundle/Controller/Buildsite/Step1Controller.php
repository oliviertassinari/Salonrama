<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class Step1Controller extends Controller
{
    public function step1Action()
    {
        $themeRepository = $this->getDoctrine()->getManager()->getRepository('SalonramaMainBundle:Theme');
        $theme = $themeRepository->findAll();

        return $this->render('SalonramaMainBundle:Buildsite:step1.html.twig', array('theme' => $theme));
    }
}

?>