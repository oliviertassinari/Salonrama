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

        $em = $this->getDoctrine()->getManager();
        $themeList = $em->getRepository('SalonramaMainBundle:Theme')->getAllList();
        $galleryList = $em->getRepository('SalonramaMainBundle:Gallery')->getAllList();

		$buildsite = new Buildsite($this, 3);

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
																				'pathFront' => '/'.$session->get('buildsite/site/pathBack'),
																				'galleryList' => json_encode($galleryList),
																				'onload' => $onload
																				));
    }
}

?>