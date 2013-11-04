<?php

class Email
{
	private $From;
	private $To;
	private $Sujet;
	private $Boundary;
	private $Header;
	private $Con;

	public function __construct($From, $To, $Sujet)
	{
		$From = str_replace('\n', '', $From);
		$From = str_replace('\r', '', $From);

		$this->From = $From;
		$this->To = $To;
		$this->Sujet = $Sujet;

		$this->Boundary = '-----='.md5(uniqid(mt_rand()));
		$this->Header = 'MIME-Version: 1.0'."\n".
						'From: '.$From."\n".
						'Content-Type: multipart/related; boundary="'.$this->Boundary."\"\n".
						'X-Priority: 3'."\n".
						'X-Mailer: PHP/'.phpversion()."\n";
		$this->Con = '';
	}

	public function addHtml($Html, $Sujet)
	{
		if(isset($Sujet) && $Sujet != '')
		{
			$Html = '<div style="font-weight:700; font-size:15px; font-family:tahoma,verdana,arial,sans-serif; margin-bottom:12px;">'.$Sujet.'</div>'.$Html;
		}

		$Structure = 
'<html>
<head>
<meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
<style>a{ color:#0367CB; text-decoration:none; } a:hover{ text-decoration:underline; }</style>
</head>
<body style="margin:0; padding:0; background:#eef4fa;">
<div align="center"><div style="width:700px; text-align:left; font-family:arial,helvetica,sans-serif; font-style:normal; font-variant:normal; font-weight:400; font-size:13px; font-size-adjust:none; font-stretch:normal; color:#000; margin:0 20px 20px;">

<div style="padding:20px 0; text-align:center; font-size:10px">Cet e-mail a été envoyé par <a href="http://www.salonrama.fr/" target="_blank"><strong>salonrama.fr</strong></a></div>
<div style="font-size:22px; font-family:tahoma,verdana,arial,sans-serif; background:#0367CB; color:#fff; padding:4px 15px; font-weight:700;">Salonrama</div>
<div style="border:1px solid #747474; border-top:none; padding:20px; background:#fff;">
'.$Html.'
</div>

<div style="border:1px solid #747474; border-top:none; padding:10px 20px; background:#fff;">
<table style="font-size:12px;">
<tr>
<td style="font-size:80px; color:#0367CB;" width="55">?</td>
<td width="145">
	<strong>Besoin d\'aide ?</strong><br/><br/>
	<a href="http://www.salonrama.fr/contact.php" target="_blank">Contactez-nous</a><br/>
	<a href="http://www.salonrama.fr/faq.php" target="_blank">Consultez la F.A.Q</a>
</td>
<td width="440">
	<strong>A Propos de Salonrama.</strong><br/>
	Salonrama est un outil vous permettant de créer rapidement le site internet de votre salon de coiffure.
</td>
</tr>
</table>
</div>

</div></div>
</body>
</html>';

		$this->Con .=  	'--'.$this->Boundary."\n".
						'Content-Type: text/html; charset="UTF-8"'."\n".
						'Content-Transfer-Encoding: 8bit'."\n\n".
						$Structure."\n\n";
	}

	public function addText($Text)
	{
		$this->Con .= 	'--'.$this->Boundary."\n".
						'Content-Type: text/plain; charset="UTF-8"'."\n".
						'Content-Transfer-Encoding: 8bit'."\n\n".
						$Text."\n\n";
	}

	public function addFile($Nom, $Con, $Type)
	{
		$this->Con .=  	'--'.$this->Boundary."\n".
						'Content-Type: '.$Type.'; name="'.$Nom.'"'."\n".
						'Content-Transfer-Encoding: base64'."\n".
						'Content-Disposition:attachement; filename="'.$Nom.'"'."\n\n".
						chunk_split(base64_encode($Con))."\n\n";
	}

	public function send()
	{
		$sujet = utf8_decode($this->Sujet);
		$sujet = mb_encode_mimeheader($sujet, 'UTF-8'); 

		if(@mail($this->To, $sujet, $this->Con, $this->Header))
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	public function setTo($To)
	{
		$this->To = $To;
	}

	public function getCon()
	{
		return $this->Con;
	}
}

?>