<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class IndexController extends Controller
{
    public function indexAction()
    {
        $themeRepository = $this->getDoctrine()->getManager()->getRepository('SalonramaMainBundle:Theme');
        $themeList = $themeRepository->getAllList();

        return $this->render('SalonramaMainBundle:Main:index.html.twig', array('theme_list' => array_slice($themeList, 0, 24)));
    }
}

?>