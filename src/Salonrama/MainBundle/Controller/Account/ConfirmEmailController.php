<?php

namespace Salonrama\MainBundle\Controller\Account;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class ConfirmEmailController extends Controller
{
    public function confirmEmailAction($id, $token)
    {
		$userRepository = $this->getDoctrine()->getManager()->getRepository('SalonramaMainBundle:User');
		$user = $userRepository->find($id);

		if($user && $user->getConfirmEmailToken() == $token)
		{
	        $email = $user->getConfirmEmail();
            $findUser = $userRepository->findOneByEmail($email);

            if(!$findUser)
	        {
	        	$em = $this->getDoctrine()->getManager();
	    		$user->setEmail($email);
	    		$user->setConfirmEmail('');
		    	$user->setConfirmEmailToken('');
		        $em->flush();

	        	$state = array('state' => 0, 'text' => 'Votre nouvel email (<b>'.$email.'</b>) a été confirmé.');
	        }
	        else
	        {
	        	$state = array('state' => 1, 'text' => 'Adresse email déjà utilisée.');
	        }
		}
		else
		{
        	$state = array('state' => 1, 'text' => 'Champs Invalides.');
		}

		return $this->render('SalonramaMainBundle:Account:confirm_email.html.twig', array('state' => $state));
	}
}

?>