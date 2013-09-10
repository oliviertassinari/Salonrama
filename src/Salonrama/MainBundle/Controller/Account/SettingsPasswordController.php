<?php

namespace Salonrama\MainBundle\Controller\Account;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints as Assert;

class SettingsPasswordController extends Controller
{
    public function passwordAction()
    {
        $request = $this->getRequest();

        if($request->isXmlHttpRequest())
        {
            $current = trim($request->request->get('password-current', ''));
            $new = trim($request->request->get('password-new', ''));
            $confirmation = trim($request->request->get('password-confirmation', ''));

            if($new == $confirmation)
            {
                $collectionConstraint = new Assert\Collection(array(
                    'current' => array(new Assert\NotBlank(),
                                        new Assert\Length(array('min' => 4, 'max' => 25))
                                        ),
                    'new' => array(new Assert\NotBlank(),
                                    new Assert\Length(array('min' => 4, 'max' => 25))
                                    )
                ));

                $errors = $this->container->get('validator')->validateValue(array(
                    'current' => $current,
                    'new' => $new,
                ), $collectionConstraint);

                if(count($errors) == 0)
                {
                    $user = $this->getUser();

                    if($user->getPassword() == $current)
                    {
                        $mailer = $this->get('salonrama_main_mailer');
                        $state = $mailer->sendNewPassword($user->getEmail(), $user->getAccount()->getName());

                        if($state == 1)
                        {
                            $em = $this->getDoctrine()->getManager();
                            $user->setPassword($new);
                            $em->flush();

                            $state = array('state' => 0, 'text' => 'Votre mot de passe a été changé.');
                        }
                        else
                        {
                            $state = array('state' => 1, 'text' => "Échec lors de l'envoi de l'email. (".$state.')');
                        }
                    }
                    else
                    {
                        $state = array('state' => 1, 'text' => 'Le mot de passe est incorrect.');
                    }
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

            return new JsonResponse($state);
        }
        else
        {
            return $this->render('SalonramaMainBundle:Account:settings_password.html.twig');
        }
    }
}

?>