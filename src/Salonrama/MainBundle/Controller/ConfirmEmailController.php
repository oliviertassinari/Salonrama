<?php

namespace Salonrama\MainBundle\Controller;

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

	        	$state = array('state' => 0, 'text' => 'Ok.');
	        }
	        else
	        {
	        	$state = array('state' => 1, 'text' => 'Adresse email déjà utilisée.');
	        }
		}
		else
		{
        	$state = array('state' => 1, 'text' => 'Paramètres incorrectes.');
		}

		return $this->render('SalonramaMainBundle:Main:confirm_email.html.twig', array('state' => $state));
	}
}

?>