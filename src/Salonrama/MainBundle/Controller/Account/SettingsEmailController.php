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
                    $state = array('state' => 0, 'text' => 'ok');
                }
                else
                {
                    $state = array('state' => 1, 'text' => "L'email est invalide");
                }
            }
            else
            {
                $sendNewsletter = trim($request->request->get('newsletter-send', ''));

                if($sendNewsletter == 'true' || $sendNewsletter == 'false')
                {
                    $em = $this->getDoctrine()->getManager();

                    if($sendNewsletter == 'true')
                    {
                        $this->getUser()->getAccount()->setSendNewsletter(true);
                    }
                    else
                    {
                        $this->getUser()->getAccount()->setSendNewsletter(false);
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