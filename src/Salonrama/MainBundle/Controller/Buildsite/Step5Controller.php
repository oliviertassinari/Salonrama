<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Salonrama\MainBundle\Buildsite;

class Step5Controller extends Controller
{
    public function step5Action()
    {
        $request = $this->getRequest();
        $session = $request->getSession();

		$buildsite = new Buildsite($session, 5);

        if(!$buildsite->isAllowed())
        {
            return $this->redirect($this->generateUrl('salonrama_main_buildsite_step'.$buildsite->getStepReach()));
        }

		$storyboard = $buildsite->getStoryboard();

        return $this->render('SalonramaMainBundle:Buildsite:step5.html.twig', array(
                                                                                'storyboard' => $storyboard,
                                                                                'pathStepFront' => $session->get('buildsite/site/pathStepFront')
                                                                            ));
    }
}

?>