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

	public function send()
	{
	    $message = \Swift_Message::newInstance()
	    ->setSubject('Hello Email')
	    ->setFrom('ne_pas_repondre@salonrama.fr')
	    ->setTo('olivier.tassinari@gmail.com')
	    ->setBody($this->templateEngine->render('SalonramaMainBundle:mailer:main.html.twig', array('title' => 'title', 'body' => 'body')), ' text/html');

	    return $this->mailer->send($message);
	}

}

?>