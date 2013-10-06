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
    	return $this->send('[Formulaire] '.$objet.' : '.$sujet, 'contact@salonrama.fr' ,'[Formulaire] '.$objet.' : '.$sujet, '<b>De</b> : '.$nom.' ('.$email.')<br><br><b>Message</b> :<br>'.$message);
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

    public function sendConfirmEmail($to, $name, $link)
    {
        $message = "Vous venez de créez votre compte Salonrama (<b>".$to."</b>).<br><br>".
                    "Pour l'activer et mettre votre site en ligne, cliquez sur le lien ci-dessous (ou copiez/collez l'URL dans votre navigateur) :<br>".
                    '<a href="'.$link.'">'.$link.'</a>';

        return $this->send("Activer votre compte Salonrama", $to, 'Bonjour, '.$name, $message);
    }

    public function sendSignin($to, $name, $link)
    {
        $message = "<h1 style='font-size: 36px; font-weight: normal; color: rgb(51, 51, 51);   margin-top: 0px; margin-bottom: 20px; text-align:center;'>Félicitations votre site a été créé !<em></em></h1>

    
                        <p style='margin: 0px; font-size: 18px; line-height: 22px;   color: rgb(51, 51, 51); font-weight: normal; text-align:center;'>Bienvenue sur Salonrama et merci pour votre confiance. <br>
                          Votre site est désormais disponible à cette adresse : </p>

                        <p style='background-color:#DFF9BD; width:100%; text-align:center; height:30px; font-size:25px;'><a href='http://hairlook.salonrama.fr'>http://hairlook.salonrama.fr</a></p>

                        <h2 style='text-align:center'>Et maintenant ?</h2>

                        <p style='font-size:18px'>Les conseils Salonrama pour vous, coiffeurs :</p>

                                          <table border='0' cellpadding='0' cellspacing='0' width='100%'>

  <tbody>
                      <tr>

    <td>
    
    
    
                        <table style='margin-top: 10px;' border='0' cellpadding='8' cellspacing='0' width='100%'>

  <tbody>
                            <tr>

    <td valign='top'>
                              <p style='margin: 0px; font-size: 17px; line-height: 22px;   color: rgb(51, 51, 51);'><img src='http://salonrama.fr/image/mails/bienvenue/salon.jpg' alt='img2' style='border: 1px solid rgb(255, 255, 255);' height='108' width='138'></p>

    
                              <p style='margin: 12px 0px; color: rgb(51, 51, 51); font-size: 18px;   font-weight: bold;'>Ajoutez une photo de votre salon</p>

    
                              <p style='margin: 0px; font-size: 16px; line-height: 24px;   color: rgb(51, 51, 51); font-weight: normal; text-align: left;'>Pour que vos clients puissent vous reconnaître et pour leur inspirer confiance. Ajoutez une photo de votre devanture ou de l'intérieur sur la page d'accueil de votre site</p>
                              <p style='margin: 0px; font-size: 16px; line-height: 24px;   color: rgb(51, 51, 51); font-weight: normal; text-align: left;'><a href='http://www.salonrama.fr/news.php/2013/07/06/comment-bien-prendre-la-photo-de-votre-salon/'>&raquo; Comment bien prendre en photo son salon ?</a></p>

    </td>

    
    <td valign='top'>
                              <p style='margin: 0px; font-size: 17px; line-height: 22px;   color: rgb(51, 51, 51);'><img src='http://salonrama.fr/image/mails/bienvenue/hair.png' alt='img3' style='border: 1px solid rgb(255, 255, 255);' height='108' width='138'></p>

     
                              <p style='margin: 12px 0px; font-size: 18px;   color: rgb(51, 51, 51); font-weight: bold;'>Présentez votre savoir-faire</p>

    
                              <p style='margin: 0px; font-size: 16px; line-height: 24px;   color: rgb(51, 51, 51); font-weight: normal;'>Attirez de nouveaux clients en présentant des photos de vos réalisations pour leur montrer votre savoir-faire. Ajoutez ces photos sur la page &quot;Galerie Photo&quot; de votre site</p>
                              <p style='margin: 0px; font-size: 16px; line-height: 24px;   color: rgb(51, 51, 51); font-weight: normal;'><a href='http://www.salonrama.fr/news.php/2013/07/14/coiffeurs-votre-savoir-faire-sur-internet/'>&raquo;Pourquoi dois-je présenter mon savoir-faire ?</a> </p>

    </td>

    
    <td valign='top'>
                              <p style='margin: 0px; font-size: 17px; line-height: 22px;   color: rgb(51, 51, 51);'><img src='http://salonrama.fr/image/mails/bienvenue/news.png' alt='img4' style='border: 1px solid rgb(255, 255, 255);' height='108' width='138'></p>

     
                              <p style='margin: 12px 0px; font-size: 18px;   color: rgb(51, 51, 51); font-weight: bold;'>Mettez régulièrement votre site à jour</p>

    
                              <p style='margin: 0px; font-size: 16px; line-height: 24px;   color: rgb(51, 51, 51); font-weight: normal;'>Vous partez en vacance et fermez le salon provisoirement ? Vous proposez à vos cliens de nouvelles promotions ? N'oubliez pas de l'ajouter sur votre site internet !<a href='http://www.salonrama.fr/news.php/'> <br>
                              </a></p>

                              <br></td>

    
    <td valign='top'>
                              <p style='margin: 0px; font-size: 17px; line-height: 22px;   color: rgb(51, 51, 51);'><img src='http://salonrama.fr/image/mails/bienvenue/boucheoreille.png' alt='img5' style='border: 1px solid rgb(255, 255, 255);' height='108' width='138'></p>

     
                              <p style='margin: 12px 0px; font-size: 18px;   color: rgb(51, 51, 51); font-weight: bold;'>Informez vos clients de votre nouveau site </p>

    
                              <p style='margin: 0px; font-size: 16px; line-height: 24px;   color: rgb(51, 51, 51); font-weight: normal;'>Votre site vient de sortir et n'est pas encore connu. Votre inscription aux moteurs de recherche (ex: google) a été faite automatiquement et vous serez indexé d'ici peu.<br>
                                <a href='http://www.salonrama.fr/news.php/2013/07/07/comment-faire-connaitre-le-site-de-votre-salon-de-coiffure/'>&raquo; Comment faire connaître mon site internet ?</a></p>

    </td>

  </tr>

                          </tbody>
                        </table>

    </td>

  </tr>

                    </tbody>
                  </table>

                                          <table border='0' cellpadding='0' cellspacing='0' width='100%'>

  <tbody>
                            <tr>

    <td height='38'><img src='http://salonrama.fr/image/newsletter/line-break-2.jpg' height='38' width='622'>
    </td>

  </tr>

                          </tbody>
                        </table>

                        <table border='0' cellpadding='0' cellspacing='0' width='100%'>

  <tbody>
                            <tr>

    <td valign='top' width='425'>
    
                              <h1 style='font-size: 18px;   color: rgb(51, 51, 51); margin-top: 0px; margin-bottom: 12px;'>Suivez l'actualité coiffure et nos conseils</h1>

    
                              <p style='margin: 0px; font-size: 16px; line-height: 22px;   color: rgb(51, 51, 51); font-weight: normal;'>Toutes les semaines nous publions des articles pertinent sur la coiffure en général et la gestion des salons de coiffure et de leur site internet pour vous aider à développer votre activité. <a style='color: rgb(188, 31, 49); text-decoration: none;' href='#'></a>Retrouvez tous nos conseils sur la page &quot;actualité&quot; de Salonrama. <a style='color: rgb(188, 31, 49); text-decoration: none;' href='#'></a><a href='http://www.salonrama.fr/news.php/'>&raquo; En savoir plus</a></p>

    </td>

    <td valign='top' width='218'><img src='http://salonrama.fr/image/mails/bienvenue/peigne-ciseaux.jpg' alt='img8' style='border: 1px solid rgb(255, 255, 255); float: right;' align='right' width='216'></td>

  </tr>

                          </tbody>
                        </table>

                        <table border='0' cellpadding='0' cellspacing='0' width='100%'>

    <tbody>
                            <tr>

        <td height='50' valign='bottom'><img src='http://salonrama.fr/image/newsletter/line-break.jpg' height='27' width='622'></td>

    </tr>

                          </tbody>
                        </table>

                        <table border='0' cellpadding='0' cellspacing='0' width='100%'>

  <tbody>
                            <tr>

    <td width='414' height='170' valign='top'>
    
                              <h1 style='font-size: 18px;   color: rgb(51, 51, 51); margin-top: 0px; margin-bottom: 12px;'>Un problème ? Une question ? Nous vous aidons !</h1>

    
                              <p style='margin: 0px; font-size: 16px; line-height: 22px;   color: rgb(51, 51, 51);'>Vous avez rencontré un problème lors de la création de votre site ?                              </p>
                              <p style='margin: 0px; font-size: 16px; line-height: 22px;   color: rgb(51, 51, 51);'> Vous souhaiteriez bénificier de nouveaux services et ainsi améliorer votre site internet ? Faîtes le nous savoir !<br>
                             <a href='http://salonrama.fr/contact.php'>   &raquo; Accéder au formulaire de contact</a></p>

    </td>

    <td valign='top' width='229'><img src='http://salonrama.fr/image/mails/bienvenue/aide.jpg' alt='img8' style='border: 1px solid rgb(255, 255, 255); float: right;' align='right' width='216'></td>

  </tr>

                          </tbody>
                        </table>

    <!--line break--><!--/line break-->
                        <table border='0' cellpadding='0' cellspacing='0' width='100%'>

  <tbody>
                            <tr>

    

  </tr>

                          </tbody>
                        </table>

                        <table width='90%' border='0' align='center' cellpadding='0' cellspacing='0' style='font-family: arial,verdana,tahoma,helvetica,sans-serif; font-size: 14px; font-weight: bold;'>

  <tbody>
                            <tr>

    <td valign='top' height='38'><p><img src='http://salonrama.fr/image/newsletter/line-break-2.jpg' height='38' width='622'></p>
      <table valign='top' style='-webkit-border-radius: 10px; -moz-border-radius: 10px; border-radius: 10px; text-align: left; font-family: arial,verdana,tahoma,helvetica,sans-serif; font-size: 18px;' bgcolor='#F0F0F0' width='643' >
        <tr>
          <th scope='col'>&nbsp;</th>
          <th scope='col'>&nbsp;</th>
        </tr>
        <tr>
          <th width='13' scope='col'>&nbsp;</th>
          <th width='202' scope='col'><img src='http://www.apercite.fr/api/apercite/160x120/non/non/http://coiffeur-94.salonrama.fr/?i' width='160' height='120'></th>
          <th width='412' height='0' valign='top' scope='col'>
<p style='font-size:14px; font-weight:bold;'>Votre site internet :<br/><span style='font-size:18px;'> <a href=".$link.">".$link."</a></span>
<br/><p style='margin-top:15px; font-size:14px; font-weight:bold;'>Votre identifiant : <br/><span style='font-size:18px;'>".$to."</span></p>
<div style='text-align:left; '><a href='http://salonrama.fr/mon-compte.php?email=".$to."><a href='http://www.salonrama.fr/mon-compte.php?email=toto@toto.com'><img src='http://salonrama.fr/image/newsletter/modifier.png' alt='modifier mon site' /></a></th>
        </tr>
      </table>
      <p><img src='http://salonrama.fr/image/newsletter/line-break-2.jpg' alt='' width='622' height='38'>Salonrama est aussi présent sur :</p>
      <p><a href='http://www.facebook.com/pages/Salonrama/89244078471'><img src='http://salonrama.fr/image/newsletter/fb.png' alt='fb'></a> <a href='https://twitter.com/salonrama'><img src='http://salonrama.fr/image/newsletter/twitter.png' alt='fb'></a> </p>
      
      </td>

  </tr>

                          </tbody>
                        </table>"; 
                        

        return $this->send("Bienvenue sur Salonrama", $to, 'Bonjour, '.$name, $message);
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