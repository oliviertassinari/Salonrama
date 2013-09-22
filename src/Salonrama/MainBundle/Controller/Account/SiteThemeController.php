<?php

namespace Salonrama\MainBundle\Controller\Account;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class SiteThemeController extends Controller
{
    public function themeAction()
    {
        $request = $this->getRequest();
        $em = $this->getDoctrine()->getManager();

        $site = $this->getUser()->getAccount()->getSite();

        $themeRepository = $em->getRepository('SalonramaMainBundle:Theme');
        $theme = $themeRepository->findAll();

        if($request->isXmlHttpRequest())
        {
        }
        else
        {

            return $this->render('SalonramaMainBundle:Account:site_theme.html.twig', array(
                                                                                        'theme' => $theme,
                                                                                        'theme_current' => $site->getTheme(),
                                                                                    ));
        }
    }
}

?>