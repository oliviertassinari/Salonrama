<?php

function EmailModuleForm($LocFileHome, $Num)
{
	if(isset($_POST['P_Email']) && $_POST['P_Email'] != '' && sizeof($_POST) > 1)
	{
		require_once('email.php');
		require_once('Env.php');

		$Message = '<em><ins>Champs remplit par le visiteur</ins></em> :<br/><br/>';

		foreach($_POST as $Name => $Var)
		{
			$Valeur = preg_replace("/(\r\n|\n|\r)/", '<br/>', htmlspecialchars($Var));
			$Champ = htmlspecialchars(str_replace('_', ' ', substr($Name, 6, strlen($Name)-6)));

			if(substr($Name, 0, 2) != 'P_')
			{
				$Message .= '<strong style="margin-left:10px;">'.$Champ.' : </strong><div>'.$Valeur.'</div><br/>';
			}
		}

		$Message .= '<br/><em><ins>Informations supplementaires</ins></em> :<br/><br/>'.
					'<strong style="margin-left:10px;">IP de l\'intenaute : </strong><div>'.getIP().' ['.getHost().']</div>';

		$email = new Email('Salonrama.fr <ne_pas_repondre@salonrama.fr>', $_POST['P_Email'], 'Salonrama : Formulaire de contact de '.$SiteUrl);
		$email->addHtml($Message, 'Formulaire de contact de <a href="'.$SiteUrl.'">'.$SiteUrl.'</a>');

		return $email->send();
	}
	else
	{
		return false;
	}
}

?>