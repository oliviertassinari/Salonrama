<?php

namespace Salonrama\MainBundle\Controller\Account;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class ConfirmEmailController extends Controller
{
    public function confirmEmailAction($id, $token)
    {
    	$em = $this->getDoctrine()->getManager();
		$userRepository = $em->getRepository('SalonramaMainBundle:User');
		$user = $userRepository->find($id);

		if($user && $user->getConfirmEmailToken() == $token)
		{
	        $email = $user->getConfirmEmail();
            $findUser = $userRepository->findOneByEmail($email);

            if(!$findUser)
	        {
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

		$session = $this->getRequest()->getSession();
		$session->getFlashBag()->add('message', $state);
        return $this->redirect($this->generateUrl('salonrama_main_account'));
	}
}

?>