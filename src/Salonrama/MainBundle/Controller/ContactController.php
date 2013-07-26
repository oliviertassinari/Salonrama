<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints as Assert;

class ContactController extends Controller
{
    public function contactAction()
    {
        $request = $this->get('request');

        if($request->isXmlHttpRequest())
        {
            $email = trim($request->request->get('contact-email', ''));
            $nom = trim($request->request->get('contact-nom', ''));
            $objet = trim($request->request->get('contact-objet', ''));
            $sujet = trim($request->request->get('contact-sujet', ''));
            $message = trim(str_replace(array("\r\n", "\r", "\n"), "<br>", $request->request->get('contact-message', '')));

            $collectionConstraint = new Assert\Collection(array(
                'email' => array(
                            new Assert\NotBlank(),
                            new Assert\Email()
                            ),
                'objet' => array(new Assert\NotBlank()),
                'sujet' => array(new Assert\NotBlank()),
                'message' => array(new Assert\NotBlank())
            ));

            $errors = $this->container->get('validator')->validateValue(array(
                'email' => $email,
                'objet' => $objet,
                'sujet' => $sujet,
                'message' => $message
            ), $collectionConstraint);

            if(count($errors) == 1)
            {
                $mailer = $this->get('salonrama_main_mailer');
                $state = $mailer->sendContact($email, $nom, $objet, $sujet, $message);

                if($state == 0)
                {
                    $state = array('state' => 0, 'text' => 'Votre message a bien été envoyé.');
                }
                else
                {
                    $state = array('state' => 1, 'text' => "Échec lors de l'envoi de l'email. (".$state.')');
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
            return $this->render('SalonramaMainBundle:Main:contact.html.twig');
        }
    }
}

?>