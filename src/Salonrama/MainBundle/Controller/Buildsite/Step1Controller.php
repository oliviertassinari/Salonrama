<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Salonrama\MainBundle\Buildsite;
use Salonrama\MainBundle\File;

class Step1Controller extends Controller
{
    public function step1Action($theme = 'RobinBleu')
    {
        $request = $this->getRequest();
        $session = $request->getSession();

        $themeRepository = $this->getDoctrine()->getManager()->getRepository('SalonramaMainBundle:Theme');
        $themeList = $themeRepository->getAllList();

		$buildsite = new Buildsite($this, 1);
		$storyboard = $buildsite->getStoryboard();
		$foot = $buildsite->getFoot();
        $message = '';

        if($request->isMethod('POST'))
        {
			$theme = $request->request->get('site-theme', $theme);

			if(in_array($theme, $themeList))
			{
				$session->set('buildsite/site/theme', $theme);

				if($buildsite->getStepReach() == 1)
				{
					$time = explode(' ', microtime());
					$id = str_replace('.', '-', $time[1] + $time[0]);

					$session->set('buildsite/site/pathBack', 'site/step/'.$id.'/');

					File::addFolder($session->get('buildsite/site/pathBack'));
					File::addFolder($session->get('buildsite/site/pathBack').'upload/');

					$buildsite->setStepReach(2);

					return $this->redirect($this->generateUrl('salonrama_main_buildsite_step2'));
				}
				else
				{
					$message = 'Votre thème a bien été modifié.';
				}
			}
        }

		return $this->render('SalonramaMainBundle:Buildsite:step1.html.twig', array(
																				'theme_list' => $themeList,
																				'theme' => $session->get('buildsite/site/theme', $theme), 
																				'storyboard' => $storyboard,
																				'foot' => $foot,
																				'message' => $message
																				));
    }
}

?>