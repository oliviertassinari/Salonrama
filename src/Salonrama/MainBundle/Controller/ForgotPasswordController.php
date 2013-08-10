<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints as Assert;

class ForgotPasswordController extends Controller
{
    public function forgotPasswordAction()
    {
		$request = $this->get('request');

		if($request->isXmlHttpRequest())
		{
            $email = htmlspecialchars(strtolower(trim($request->request->get('forgot-email', ''))));
            $errors = $this->container->get('validator')->validateValue($email, array(
														                            new Assert\NotBlank(),
														                            new Assert\Email()
                            														));

            if(count($errors) == 0)
            {
				$userRepository = $this->getDoctrine()->getManager()->getRepository('SalonramaMainBundle:User');
				$user = $userRepository->findOneByEmail($email);

				if($user)
				{
                    if($user->getResetPasswordToken() == '')
                    {
                    	$em = $this->getDoctrine()->getManager();
						$user->setResetPasswordToken(md5(uniqid(null, true)));
                    	$em->flush();
                    }

	                $mailer = $this->get('salonrama_main_mailer');
	                $state = $mailer->sendForgotPassword($user->getEmail(), $user->getAccount()->getName(), 'http://www.salonrama.fr/reset_password/'.
	                																				$user->getId().'/'.$user->getResetPasswordToken());

	                if($state == 1)
	                {
	                    $state = array('state' => 0, 'text' => '<strong>Nous avons envoyé les instructions de réinitialisation de mot de passe à '.$email.'.</strong><br><br>'.
																"Si vous ne recevez pas les instructions d'ici une minute ou deux, vérifiez les filtres de spams et de courriers indésirables de votre compte.");
	                }
	                else
	                {
	                    $state = array('state' => 1, 'text' => "Échec lors de l'envoi de l'email. (".$state.')');
	                }
				}
				else
				{				
					$state = array('state' => 1, 'text' => "L'email est introuvable");
				}
            }
            else
            {
				$state = array('state' => 1, 'text' => "L'email est invalide");
            }

			return new JsonResponse($state);
		}
		else
		{
        	return $this->render('SalonramaMainBundle:Main:forgot_password.html.twig');
		}
    }
}

?>