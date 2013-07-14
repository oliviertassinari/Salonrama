<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class MainController extends Controller
{
    public function indexAction()
    {
        return $this->render('SalonramaMainBundle:Main:index.html.twig');
    }

    public function contactAction()
    {
        $request = $this->get('request');

        if($request->isXmlHttpRequest())
        {
            $email = $request->request->get('contact-email', '');
            $nom = $request->request->get('contact-nom', '');
            $objet = $request->request->get('contact-objet', '');
            $sujet = $request->request->get('contact-sujet', '');
            $message = $request->request->get('contact-message', '');

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

    public function presseAction()
    {
        return $this->render('SalonramaMainBundle:Main:presse.html.twig');
    }

    public function aproposAction()
    {
        return $this->render('SalonramaMainBundle:Main:apropos.html.twig');
    }

    public function mentionLegaleAction()
    {
        return $this->render('SalonramaMainBundle:Main:mention-legale.html.twig');
    }
}

?>