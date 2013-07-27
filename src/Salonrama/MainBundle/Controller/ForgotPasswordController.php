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
				$accountRepository = $this->getDoctrine()->getManager()->getRepository('SalonramaMainBundle:User');
				$user = $accountRepository->findOneByEmail($email);

				if($user)
				{
	                $mailer = $this->get('salonrama_main_mailer');
	                $state = $mailer->sendForgot($user->getEmail(), 'name', 'link');

	                if($state == 0)
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