<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Salonrama\MainBundle\Buildsite;
use Salonrama\MainBundle\File;

class Step2Controller extends Controller
{
    public function step2Action()
    {
		$buildsite = new Buildsite(2);
		$storyboard = $buildsite->getStoryboard();
		$foot = $buildsite->getFoot();

		return $this->render('SalonramaMainBundle:Buildsite:step2.html.twig', array(
        																		'storyboard' => $storyboard,
        																		'foot' => $foot
        																		));
    }
}

?>