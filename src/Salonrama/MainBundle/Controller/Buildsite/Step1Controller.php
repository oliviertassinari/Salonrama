<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Salonrama\MainBundle\Buildsite;
use Salonrama\MainBundle\File;

class Step1Controller extends Controller
{
    public function step1Action()
    {
        $request = $this->get('request');

        $themeRepository = $this->getDoctrine()->getManager()->getRepository('SalonramaMainBundle:Theme');
        $theme = $themeRepository->findAll();

		$buildsite = new Buildsite(1);
		$storyboard = $buildsite->getStoryboard();
		$foot = $buildsite->getFoot();
        $message = '';

        if($request->isMethod('POST'))
        {
			if($buildsite->stepReach == 1)
			{
				$time = explode(' ', microtime());
				$id = str_replace('.', '-', $time[1] + $time[0]);

				$_SESSION['buildsite']['id'] = $id;
				$_SESSION['buildsite']['site'] = array();
				$_SESSION['buildsite']['site']['loc'] = '../../Site/etape/'.$id.'/';

				File::addFolder($_SESSION['buildsite']['site']['loc']);
				File::addFolder($_SESSION['buildsite']['site']['loc'].'upload/');

				$_SESSION['buildsite']['site']['theme'] = htmlspecialchars($_POST['site-theme']);
				$_SESSION['buildsite']['stepReach'] = 2;

				return $this->redirect($this->generateUrl('salonrama_main_buildsite_step2'));
			}
			else
			{
				$_SESSION['buildsite']['site']['theme'] = htmlspecialchars($_POST['site-theme']);

				$message = 'Votre thème a bien été modifié.';
			}
        }

		return $this->render('SalonramaMainBundle:Buildsite:step1.html.twig', array(
																				'theme' => $theme,
																				'theme_current' => 'RobinBleu', 
																				'storyboard' => $storyboard,
																				'foot' => $foot,
																				'message' => $message
																				));
    }
}

?>