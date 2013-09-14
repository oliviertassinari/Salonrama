<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Salonrama\MainBundle\Buildsite;
use Salonrama\MainBundle\File;

class Step1Controller extends Controller
{
    public function step1Action()
    {
        $request = $this->getRequest();
        $session = $request->getSession();

        $themeRepository = $this->getDoctrine()->getManager()->getRepository('SalonramaMainBundle:Theme');
        $theme = $themeRepository->findAll();

		$buildsite = new Buildsite($session, 1);
		$storyboard = $buildsite->getStoryboard();
		$foot = $buildsite->getFoot();
        $message = '';

        if($request->isMethod('POST'))
        {
			$session->set('buildsite/site/theme', htmlspecialchars($request->request->get('site-theme', 'RobinBleu')));

			if($buildsite->stepReach == 1)
			{
				$time = explode(' ', microtime());
				$id = str_replace('.', '-', $time[1] + $time[0]);
				$locApache = '../src/Salonrama/MainBundle/Site/step/'.$id.'/';

				$session->set('buildsite/id', $id);
				$session->set('buildsite/site/locApache', $locApache);
				$session->set('buildsite/site/locBundle', '');

				File::addFolder($locApache);
				File::addFolder($locApache.'upload/');

				$session->set('buildsite/stepReach', 2);

				return $this->redirect($this->generateUrl('salonrama_main_buildsite_step2'));
			}
			else
			{
				$message = 'Votre thème a bien été modifié.';
			}
        }

		return $this->render('SalonramaMainBundle:Buildsite:step1.html.twig', array(
																				'theme' => $theme,
																				'theme_current' => $session->get('buildsite/site/theme', 'RobinBleu'), 
																				'storyboard' => $storyboard,
																				'foot' => $foot,
																				'message' => $message
																				));
    }
}

?>