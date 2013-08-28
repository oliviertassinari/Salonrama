<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints as Assert;

class ResetPasswordController extends Controller
{
    public function resetPasswordAction($id, $token)
    {
		$userRepository = $this->getDoctrine()->getManager()->getRepository('SalonramaMainBundle:User');
		$user = $userRepository->find($id);

		if($user && $token != '' && $user->getResetPasswordToken() == $token)
		{
			$isAllowed = true;
		}
		else
		{
			$isAllowed = false;
		}

		$request = $this->get('request');

		if($request->isXmlHttpRequest())
		{
			if($isAllowed)
			{
	            $new = trim($request->request->get('reset-new', ''));
	            $confirmation = trim($request->request->get('reset-confirmation', ''));

	            if($new == $confirmation)
	            {
		            $errors = $this->container->get('validator')->validateValue($new, array(
																                            new Assert\NotBlank(),
																                            new Assert\Length(array('min' => 4, 'max' => 25))
		                            														));

	                if(count($errors) == 0)
	                {
                        $em = $this->getDoctrine()->getManager();
	                	$user->setPassword($new);
	                	$user->setResetPasswordToken('');
                        $em->flush();

	                    $state = array('state' => 0, 'text' => 'Votre mot de passe a été changé.');
	                }
	                else
	                {
	                    $state = array('state' => 1, 'text' => 'Champs Invalides.');
	                }
	            }
	            else
	            {
	                $state = array('state' => 1, 'text' => 'Les mots de passe ne correspondent pas.');
            	}
            }
            else
            {
                $state = array('state' => 1, 'text' => 'Champs Invalides.');
            }

			return new JsonResponse($state);
		}
		else
		{
			return $this->render('SalonramaMainBundle:Main:reset_password.html.twig', array('is_allowed' => $isAllowed));
		}
    }
}

?>