<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class ContactController extends Controller
{
    public function contactAction()
    {
        $request = $this->get('request');

        if($request->isXmlHttpRequest())
        {
            $email = $request->request->get('contact-email', '');
            $nom = $request->request->get('contact-nom', '');
            $objet = $request->request->get('contact-objet', '');
            $sujet = $request->request->get('contact-sujet', '');
            $message = str_replace(array("\r\n", "\r", "\n"), "<br>", $request->request->get('contact-message', ''));

            if($email != '' && $objet != '' && $sujet != '' && $message != '')
            {
                $mailer = $this->get('salonrama_main.mailer');
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