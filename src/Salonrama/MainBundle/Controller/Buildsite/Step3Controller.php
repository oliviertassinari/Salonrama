<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Salonrama\MainBundle\Buildsite;
use Salonrama\MainBundle\File;

class Step3Controller extends Controller
{
    public function step3Action()
    {
        $request = $this->getRequest();
        $session = $request->getSession();

        $themeRepository = $this->getDoctrine()->getManager()->getRepository('SalonramaMainBundle:Theme');
        $theme = $themeRepository->findAll();

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

		$themeList = array();

		foreach ($theme as $key => $value) {
			array_push($themeList, $value->getName());
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
																				'locHomeSite' => $session->get('buildsite/site/locBundle'),
																				'imageBddList' => File::readFile('../src/Salonrama/MainBundle/Site/bdd_img_list.txt'),
																				'onload' => $onload
																				));
    }
}

?>