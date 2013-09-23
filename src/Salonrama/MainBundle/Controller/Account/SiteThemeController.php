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
        $themeList = $themeRepository->getAllList();

        if($request->isXmlHttpRequest())
        {
            $theme = $request->request->get('site-theme');

            if(in_array($theme, $themeList))
            {
                if($theme != $site->getTheme())
                {
                    $site->setTheme($theme);
                    $site->update();

                    $em->flush();
                }

                $state = array('state' => 0, 'text' => 'Votre thème a été modifié et votre site mise à jour.<br><a href="'.$site->getUrl().'" target="_blank">'.$site->getUrl().'</a>');
            }
            else
            {
                $state = array('state' => 1, 'text' => "Ce thème n'existe pas.");
            }

            return new JsonResponse($state);
        }
        else
        {

            return $this->render('SalonramaMainBundle:Account:site_theme.html.twig', array(
                                                                                        'theme_list' => $themeList,
                                                                                        'theme' => $site->getTheme(),
                                                                                    ));
        }
    }
}

?>