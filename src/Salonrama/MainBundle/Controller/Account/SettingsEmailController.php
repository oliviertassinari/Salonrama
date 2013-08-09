<?php

namespace Salonrama\MainBundle\Controller\Account;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints as Assert;

class SettingsEmailController extends Controller
{
    public function emailAction()
    {
        $request = $this->get('request');

        if($request->isXmlHttpRequest())
        {
            if($request->request->has('email-email'))
            {
                $email = trim($request->request->get('email-email', ''));

                $errors = $this->container->get('validator')->validateValue($email, array(
                                                                                new Assert\NotBlank(),
                                                                                new Assert\Email()
                                                                            ));
                if(count($errors) == 0)
                {
                    $user = $this->getUser();

                    if($email != $user->getEmail())
                    {
                        $userRepository = $this->getDoctrine()->getManager()->getRepository('SalonramaMainBundle:User');
                        $user = $userRepository->findOneByEmail($email);

                        if(!$user)
                        {
                            $mailer = $this->get('salonrama_main_mailer');
                            $state1 = $mailer->sendChangeEmailNew($email, $user->getAccount()->getName(), $user->getEmail(), 'link');
                            $state2 = $mailer->sendChangeEmailOld($user->getEmail(), $user->getAccount()->getName());

                            $state = array('state' => 0, 'text' => 'ok');
                        }
                        else
                        {
                            $state = array('state' => 1, 'text' => 'Adresse email déjà utilisée');
                        }
                    }
                    else
                    {
                        $state = array('state' => 1, 'text' => "C'est vous");
                    }
                }
                else
                {
                    $state = array('state' => 1, 'text' => "L'email est invalide");
                }
            }
            else
            {
                $newsletterSend = trim($request->request->get('newsletter-send', ''));

                if($newsletterSend == 'true' || $newsletterSend == 'false')
                {
                    $em = $this->getDoctrine()->getManager();

                    if($newsletterSend == 'true')
                    {
                        $this->getUser()->getAccount()->setNewsletterSend(true);
                    }
                    else
                    {
                        $this->getUser()->getAccount()->setNewsletterSend(false);
                    }

                    $em->flush();

                    $state = array('state' => 0, 'text' => 'Modifications sauvegardées.');
                }
                else
                {
                    $state = array('state' => 1, 'text' => 'Champ Invalide.');
                }
            }

            return new JsonResponse($state);
        }
        else
        {
            return $this->render('SalonramaMainBundle:Account:settings_email.html.twig');
        }
    }
}

?>