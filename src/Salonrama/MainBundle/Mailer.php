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

    public function sendForgotPassword($to, $name, $link)
    {
        $message = 'Salonrama a reçu une demande pour réinitialiser le mot de passe de votre compte (<b>'.$to.'</b>).<br><br>'.
                    "Pour réinitialiser votre mot de passe, cliquez sur le lien ci-dessous (ou copiez/collez l'URL dans votre navigateur) :<br>".
                    '<a href="'.$link.'">'.$link.'</a>';

        return $this->send('Réinitialiser votre mot de passe Salonrama', $to, 'Vous avez oublié votre mot de passe, '.$name.' ?', $message);
    }

    public function sendNewPassword($to, $name)
    {
        $message = 'Vous avez récemment changé le mot de passe associé à votre compte Salonrama (<b>'.$to.'</b>).';

        return $this->send('Votre mot de passe Salonrama a été changé', $to, 'Bonjour, '.$name, $message);
    }

    public function sendChangeEmailNew($to, $name, $emailOld, $link)
    {
        $message = "Vous avez récemment changé l'adresse email associée à votre compte Salonrama (<b>".$emailOld."</b>).<br><br>".
                    "Pour confirmer ".$to." comme nouvel email, cliquez sur le lien ci-dessous (ou copiez/collez l'URL dans votre navigateur) :<br>".
                    '<a href="'.$link.'">'.$link.'</a>';

        return $this->send("Confirmez l'adresse email associée à votre compte Salonrama", $to, 'Bonjour, '.$name, $message);
    }

    public function sendChangeEmailOld($to, $name)
    {
        $message = "Vous avez récemment changé l'adresse email associée à votre compte Salonrama (<b>".$to."</b>).<br>".
                    'Pour confirmer votre nouvel email, veuillez suivre le lien dans le message de confirmation envoyé à la nouvelle adresse.';

        return $this->send("Salonrama a reçu une demande de changement de l'adresse email liée à votre compte", $to, 'Bonjour, '.$name, $message);
    }

	public function send($subject, $to, $title, $body)
	{
	    $message = \Swift_Message::newInstance()
	    ->setSubject($subject)
	    ->setFrom('ne_pas_repondre@salonrama.fr')
	    ->setTo($to)
	    ->setBody($this->templateEngine->render('SalonramaMainBundle:Mailer:main.html.twig', array('title' => $title, 'body' => $body)), 'text/html');

	    return $this->mailer->send($message);
	}
}

?>