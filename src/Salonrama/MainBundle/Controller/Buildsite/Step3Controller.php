<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Salonrama\MainBundle\Buildsite;

class Step3Controller extends Controller
{
    public function step3Action()
    {
        $request = $this->getRequest();
        $session = $request->getSession();

        $site = $this->getUser()->getAccount()->getSite();

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
																				'blockList' => $site->get('buildsite/site/blockList'),
																				'dataList' => $site->get('buildsite/site/dataList'),
																				'imageList' => $site->get('buildsite/site/imageList'),
																				'themeAct' => $site->get('buildsite/site/theme'),
																				'themeList' => json_encode($themeList),
																				'pageList' => $site->get('buildsite/site/pageList'),
																				'pageAct' => 'index',
																				'pathStepFront' => $site->get('buildsite/site/pathStepFront'),
																				'galleryList' => json_encode($galleryList),
																				'onload' => $onload
																				));
    }
}

?>