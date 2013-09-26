<?php

class GForm
{
	private $ChampList = array();
	private function CallBack(){ }

	public function __construct($CallBack)
	{
		$this->CallBack = $CallBack;
	}

	public function addChamp($Type, $Nom, $Param)
	{
		if($Type == 'Input')
		{
			$Param['LenMin'] = (isset($Param['LenMin'])) ? $Param['LenMin'] : 1;
			$Param['LenMax'] = (isset($Param['LenMax'])) ? $Param['LenMax'] : 40;
			$Param['Facul'] = (isset($Param['Facul'])) ? $Param['Facul'] : false;

			if(isset($Param['RegExp']))
			{
				if($Param['RegExp'] == 'email')
				{
					$Param['RegExp'] = array('Code' => "#^[a-zA-Z0-9!\#$%&'*+-\/=?^_`.{|}~]{0,64}@[a-z0-9._-]{2,255}\.[a-z]{2,4}$#", 'errorDescription' => 'e-mail invalide');
					$Param['LenMax'] = 320;
				}
				else if($Param['RegExp'] == 'NumClient')
				{
					$Param['RegExp'] = array('Code' => "#^[0-9]*$#", 'errorDescription' => 'Il doit y avoir que des chiffres');
					$Param['LenMin'] = 6;
					$Param['LenMax'] = 6;
				}
			}
		}

		$this->ChampList[$Nom] = array($Type, $Param);
	}

	public function getEtatInput($Value, $ChampAct)
	{
		$Param = $ChampAct[1];

		if(isset($Param['LenMax']) && is_numeric($Param['LenMax']) && strlen($Value) > $Param['LenMax'])
		{
			$Etat = array('error' => 1, 'description' => 'Champ trop long ('.$Param['LenMax'].' max)');
		}
		else if(isset($Param['LenMin']) && is_numeric($Param['LenMin']) && strlen($Value) < $Param['LenMin'])
		{
			if(strlen($Value)== 0){
				$Etat = array('error' => 1, 'description' => 'Champ vide');
			}
			else{
				$Etat = array('error' => 1, 'description' => 'Champ trop court ('.$Param['LenMin'].' min)');
			}
		}
		else if(isset($Param['RegExp']) && isset($Param['RegExp']['Code']) && preg_match($Param['RegExp']['Code'], $Value) == false)
		{
			$Etat = array('error' => 1, 'description' => $Param['RegExp']['errorDescription']);
		}
		else{
			$Etat = array('error' => 0, 'description' => 'Ok');
		}

		return $Etat;
	}

	public function getEtatTexta($Value, $ChampAct)
	{
		if(strlen($Value) > 0)
		{
			return array('error' => 0, 'description' => 'Ok');
		}
		else
		{
			return array('error' => 1, 'description' => 'Champ vide');
		}
	}

	public function getEtatSelect($Value, $ChampAct)
	{
		if($Value != 'empty')
		{
			return array('error' => 0, 'description' => 'Ok');
		}
		else
		{
			return array('error' => 1, 'description' => 'Champ invalide');
		}
	}

	
	public function getChampErr($Nom)
	{
		if(isset($_POST[$Nom]) && isset($this->ChampList[$Nom]))
		{
			$Value = $_POST[$Nom];
			$ChampAct = $this->ChampList[$Nom];

			$Type = $ChampAct[0];

			if($Type == 'Input')
			{
				$Etat = $this->getEtatInput($Value, $ChampAct);

				if($ChampAct[1]['Facul'] === true && $Value == ''){
					$Etat['error'] = -1;
				}
			}
			else if($Type == 'Texta')
			{
				$Etat = $this->getEtatTexta($Value, $ChampAct);
			}
			else if($Type == 'Select')
			{
				$Etat = $this->getEtatSelect($Value, $ChampAct);
			}

			if($Etat['error'] == 0)
			{
				echo $this->getChampErrHtml(true, $Etat['description']);
			}
			else if($Etat['error'] == 1)
			{
				echo $this->getChampErrHtml(false, $Etat['description']);
			}
		}
	}

	public function getChampErrHtml($Etat, $Text)
	{
		if($Etat === true){
			$ClassName = 'form-input-state-ok';
			$Text = '<i class="icon-ok"></i>'.$Text;
		}
		else if($Etat === false){
			$ClassName = 'form-input-state-error';
			$Text = '<i class="icon-remove"></i>'.$Text;
		}
		else{
			$ClassName = '';
		}

		return '<span class="'.$ClassName.'">'.$Text.'</span>';
	}

	public function getVerifAll()
	{
		$R = 0;
		$isPOST = false;

		foreach($this->ChampList as $Nom => $ChampAct)
		{
			if(isset($_POST[$Nom]))
			{
				$Value = $_POST[$Nom];
				$Type = $ChampAct[0];

				if($Type == 'Input')
				{
					$Etat = $this->getEtatInput($Value, $ChampAct);

					if($ChampAct[1]['Facul'] === true && $Value == ''){
						$Etat['error'] = 0;
					}
				}
				else if($Type == 'Texta')
				{
					$Etat = $this->getEtatTexta($Value, $ChampAct);
				}
				else if($Type == 'Select')
				{
					$Etat = $this->getEtatSelect($Value, $ChampAct);
				}

				$R += $Etat['error'];
				$isPOST = true;
			}
			else
			{
				break; //stop
			}
		}

		if($isPOST === true){
			return $R;
		}
		else{
			return false;
		}
	}

	public function getEtat()
	{
		$R = $this->getVerifAll();

		if($R !== false && $this->CallBack && is_callable(array($this, 'CallBack'))) //is fonction
		{
			call_user_func($this->CallBack, $this, $R);
		}
	}

	public function getEtatHtml($Etat, $Text, $Id)
	{
		if($Etat === true){
			$ClassName = 'frame-small-green';
			$Text = '<i class="icon-ok"></i>'.$Text;
		}
		else if($Etat === false){
			$ClassName = 'frame-small-red';
			$Text = '<i class="icon-warning-sign"></i>'.$Text;
		}
		else if($Etat == ''){
			$ClassName = '';
		}

		echo '<div id="'.$Id.'" class="form-global-state frame-small '.$ClassName.'" style="display:block;">'.$Text.'</div>';
	}

	public function getValue($Nom)
	{
		if(isset($_POST[$Nom]))
		{
			echo 'value="'.$_POST[$Nom].'"';
		}
	}
	
	public function getTexta($Nom)
	{
		if(isset($_POST[$Nom]))
		{
			echo $_POST[$Nom];
		}
	}

	public function getSelected($VarAct, $Nom)
	{
		if(isset($_POST[$Nom]) && isset($this->ChampList[$Nom]))
		{
			if($VarAct == $_POST[$Nom])
			{
				echo 'selected="selected"';
			}
		}
	}
}

?>