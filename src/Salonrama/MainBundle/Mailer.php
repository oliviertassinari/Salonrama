<?php

namespace Salonrama\MainBundle;

class Mailer
{
    private $mailer;
    private $templateEngine;

    public function __construct(\Swift_Mailer $mailer, $templateEngine)
    {
        $this->mailer = $mailer;
     	$this->templateEngine = $templateEngine;
    }

    public function sendContact($email, $nom, $objet, $sujet, $message)
    {
    	return $this->send('[Contact] '.$objet.' : '.$sujet, 'olivier.tassinari@gmail.com' ,'[Contact] '.$objet.' : '.$sujet, $message);
    }

    public function sendForgot($to, $name, $link)
    {
        $message = 'Salonrama a reçu une demande pour réinitialiser le mot de passe de votre compte.<br><br>'.
                    "Pour réinitialiser votre mot de passe, cliquez sur le lien ci-dessous (ou copiez/collez l'URL dans votre navigateur) :<br>".
                    '<a href="'.$link.'">'.$link.'</a>';

        return $this->send('Réinitialiser votre mot de passe Salonrama',  $to, 'Vous avez oublié votre mot de passe, '.$name.' ?' , $message);
    }

	public function send($subject, $to, $title, $body)
	{
	    $message = \Swift_Message::newInstance()
	    ->setSubject($subject)
	    ->setFrom('ne_pas_repondre@salonrama.fr')
	    ->setTo($to)
	    ->setBody($this->templateEngine->render('SalonramaMainBundle:Mailer:main.html.twig', array('title' => $title, 'body' => $body)), ' text/html');

	    return $this->mailer->send($message);
	}
}

?>