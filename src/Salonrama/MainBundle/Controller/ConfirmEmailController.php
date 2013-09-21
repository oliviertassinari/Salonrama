<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;
use Symfony\Component\Security\Http\SecurityEvents;
use Salonrama\MainBundle\File;

class ConfirmEmailController extends Controller
{
    public function confirmEmailAction($id, $token)
    {
    	$em = $this->getDoctrine()->getManager();
		$userRepository = $em->getRepository('SalonramaMainBundle:User');
		$user = $userRepository->find($id);
		$state = array('state' => 1, 'text' => 'Champs Invalides.');
 
		if($user && $user->getConfirmEmailToken() == $token && $user->getConfirmEmail() == $user->getEmail())
		{
			$account = $user->getAccount();
			$site = $account->getSite();

			$subdomain = $this->get('salonrama_main_subdomain');
			$state = $subdomain->addSite($site->getSubdomain(), $site->getId());

			if($state['state'] == 0)
			{
				$pathBackNew = 'site/online/'.$site->getId().'/';
				File::addFolder($pathBackNew);
				File::copyFolder($site->getPathBack(), $pathBackNew);
				File::removeFolder($site->getPathBack());

				$site->setPathBack($pathBackNew);
				$site->setIsOnline(true);
				$site->update();

		        $user->setIsActive(true);
				$user->setConfirmEmail('');
				$user->setConfirmEmailToken('');

				$em->flush();

				$token = new UsernamePasswordToken($user, $user->getPassword(), 'secured_area', $user->getRoles());
				$this->container->get('security.context')->setToken($token);

				$this->container->get('event_dispatcher')->dispatch(
					SecurityEvents::INTERACTIVE_LOGIN,
					new InteractiveLoginEvent($this->container->get('request'), $token)
				);

				$mailer = $this->get('salonrama_main_mailer');
				$mailer->sendSignin($user->getEmail(), $account->getName(), $site->getUrl());
			}
		}

		if($state['state'] == 0)
		{
			return $this->redirect($this->generateUrl('salonrama_main_account'));
		}
		else
		{
			return $this->render('SalonramaMainBundle:Main:display_state.html.twig', array(
																						'state' => $state,
																						'title' => 'Activer votre compte Salonrama'
																						));
		}
	}
}

?>