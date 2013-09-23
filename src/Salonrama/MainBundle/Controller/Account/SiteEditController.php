<?php

namespace Salonrama\MainBundle\Controller\Account;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Salonrama\MainBundle\Buildsite;
use Salonrama\MainBundle\File;

class SiteEditController extends Controller
{
    public function editAction()
    {
        $request = $this->getRequest();

        $em = $this->getDoctrine()->getManager();
        $themeList = $em->getRepository('SalonramaMainBundle:Theme')->getAllList();
        $galleryList = $em->getRepository('SalonramaMainBundle:Gallery')->getAllList();

        $buildsite = new Buildsite($session, 3);

        if(!$buildsite->isAllowed())
        {
            return $this->redirect($this->generateUrl('salonrama_main_buildsite_step'.$buildsite->getStepReach()));
        }

        $storyboard = $buildsite->getStoryboard();
        $foot = $buildsite->getFoot();
        $onload = '';

        foreach ($session->getFlashBag()->get('onload', array()) as $value) {
            $onload = $value;
        }

        return $this->render('SalonramaMainBundle:Buildsite:step3.html.twig', array(
                                                                                'storyboard' => $storyboard,
                                                                                'foot' => $foot,
                                                                                'blockList' => $session->get('buildsite/site/blockList'),
                                                                                'dataList' => $session->get('buildsite/site/dataList'),
                                                                                'imageList' => $session->get('buildsite/site/imageList'),
                                                                                'themeAct' => $session->get('buildsite/site/theme'),
                                                                                'themeList' => json_encode($themeList),
                                                                                'pageList' => $session->get('buildsite/site/pageList'),
                                                                                'pageAct' => 'index',
                                                                                'pathStepFront' => $session->get('buildsite/site/pathStepFront'),
                                                                                'galleryList' => json_encode($galleryList),
                                                                                'onload' => $onload
                                                                                ));
    }
}

?>