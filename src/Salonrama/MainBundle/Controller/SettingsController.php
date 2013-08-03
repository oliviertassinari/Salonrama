<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints as Assert;

class SettingsController extends Controller
{
    public function generalAction()
    {
        $request = $this->get('request');

        if($request->isXmlHttpRequest())
        {
            $firstName = trim($request->request->get('general-firstname', ''));
            $lastName = trim($request->request->get('general-lastname', ''));

            $collectionConstraint = new Assert\Collection(array(
                'firstName' => array(new Assert\NotBlank()),
                'lastName' => array(new Assert\NotBlank())
            ));

            $errors = $this->container->get('validator')->validateValue(array(
                'firstName' => $firstName,
                'lastName' => $lastName,
            ), $collectionConstraint);

            if(count($errors) == 0)
            {
                $user = $this->getUser();
                $em = $this->getDoctrine()->getManager();

                $user->getAccount()->setFirstName($firstName)->setLastName($lastName);

                $em->flush();

                $state = array('state' => 0, 'text' => 'Modifications sauvegardées.');
            }
            else
            {
                $state = array('state' => 1, 'text' => 'Champs Invalides.');
            }

            return new JsonResponse($state);
        }
        else
        {
            return $this->render('SalonramaMainBundle:Account:settings_general.html.twig');
        }
    }

    public function emailAction()
    {
        $request = $this->get('request');

        if($request->isXmlHttpRequest())
        {
            $email = trim($request->request->get('email-email', ''));

            $errors = $this->container->get('validator')->validateValue($email, array(
                                                                            new Assert\NotBlank(),
                                                                            new Assert\Email()
                                                                        ));
            if(count($errors) == 0)
            {
                $state = array('state' => 0, 'text' => 'ok');
            }
            else
            {
                $state = array('state' => 1, 'text' => "L'email est invalide");
            }

            return new JsonResponse($state);
        }
        else
        {
            return $this->render('SalonramaMainBundle:Account:settings_email.html.twig');
        }
    }

    public function passwordAction()
    {
        $request = $this->get('request');

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

    public function deleteAction()
    {
        $request = $this->get('request');

        if($request->isXmlHttpRequest())
        {
            $password = trim($request->request->get('delete-password', ''));

            $errors = $this->container->get('validator')->validateValue($password, array(
                                                                                        new Assert\NotBlank(),
                                                                                        new Assert\Length(array('min' => 4, 'max' => 25))
                                                                                ));

            if(count($errors) == 0)
            {
                $user = $this->getUser();

                if($user->getPassword() == $password)
                {
                    $state = array('state' => 0, 'text' => 'Champ Invalide.');
                }
                else
                {
                    $state = array('state' => 1, 'text' => 'Le mot de passe est incorrect.');
                }
            }
            else
            {
                $state = array('state' => 1, 'text' => 'Champ Invalide.');
            }

            return new JsonResponse($state);
        }
        else
        {
            return $this->render('SalonramaMainBundle:Account:settings_delete.html.twig');
        }
    }
}

?>