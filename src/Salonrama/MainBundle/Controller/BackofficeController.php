<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class BackofficeController extends Controller
{
    public function backofficeAction()
    {
        $themeRepository = $this->getDoctrine()->getManager()->getRepository('SalonramaMainBundle:Site');
        $themeList = $themeRepository->getAllList();

        return $this->render('SalonramaMainBundle:Main:backoffice.html.twig', array('theme_list' => array_slice($themeList, 0, 24)));
    }
}

?>