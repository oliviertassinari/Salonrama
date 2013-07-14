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