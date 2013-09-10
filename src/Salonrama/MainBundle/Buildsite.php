<?php

namespace Salonrama\MainBundle;

class Buildsite
{
	public $step;
	public $stepCurrent;
	public $stepReach;

    public function __construct($session, $stepCurrent)
    {
        $this->step = array(
								1 => array('Thème', 'etape1.php'),
								2 => array('Mon salon', 'etape2.php'),
								3 => array('Mon site', 'etape3.php'),
								4 => array('Adresse internet', 'etape4.php', 200),
								5 => array('Publication', 'etape5.php')
							);

        $this->stepCurrent = $stepCurrent;
		$this->stepReach = $session->get('buildsite/stepReach', 1);
    }

	public function isAllowed($redirect = true)
	{
		if($this->stepReach < $this->stepCurrent) //Syst Redirection
		{
			if($redirect){
				header('location:etape'. $this->stepReach .'.php');
				exit();
			}
			else{
				return false;
			}
		}
		else
		{
			return true;
		}
	}

	public function getStoryboard()
	{
		$storyboard = '';
		$height = 0;

		for($i = 1; $i < sizeof($this->step)+1; $i++)
		{
			if($i < $this->stepCurrent)
			{
				if($i < $this->stepCurrent-1){
					$class = 'Ok';
				}
				else{
					$class = 'CourEnd';
				}
			}
			else if($i == $this->stepCurrent)
			{
				if($i == sizeof($this->step)){
					$class = 'Fin';
				}
				else if($i == $this->stepReach){
					$class = 'CourStart';
				}
				else{
					$class = 'CoursModi';
				}
			} 
			else if($i <= $this->stepReach)
			{
				if($i == $this->stepReach){
					$class = 'OkStart';
				}
				else{
					$class = 'Ok';
				}
			}
			else
			{
				if($i == sizeof($this->step)){
					$class = 'FinBlanc';
				}
				else{
					$class = 'Blanc';
				}
			}

			if(isset($this->step[$i][2])){
				$more = ' style="width:'.$this->step[$i][2].'px;"';
				$height += $this->step[$i][2]; 
			}
			else{
				$more = '';
				$height += 150; 
			}

			if($i <= $this->stepReach){
				$storyboard .= '<li class="'.$class.'"'.$more.'><a href="step'.$i.'" title="Retourner à l\'étape '.$i.'"><span>'.$i.'</span>'.$this->step[$i][0].'</a></li>';
			}
			else{
				$storyboard .= '<li class="'.$class.'"'.$more.'><span>'.$i.'</span>'.$this->step[$i][0].'</li>';
			}
		}

		return '<div id="storyboard" style="width:'.$height.'px;"><ul>'.$storyboard.'</ul></div>';
	}

    public function getFoot()
	{
		$foot = '';

		if(!isset($this->stepCurrent)) // Administration
		{
			$foot .= '<div id="EtapeSuivant" title="retour à l\'administration"><p>retour à l\'admin.</p></div>'.
				  '<div id="EtapeValide" class="ButtonBigYellow">Sauvegarder</div>'.
				  '<div id="EtapeAide" onclick="Ot.openPopup(\'aide/etape3.php\', \'560\', \'650\')" title="Aide"><p>Aide</p></div>';
		}
		else
		{
			if($this->stepCurrent < $this->stepReach)
			{
				$foot .= '<div id="EtapeSuivant" onclick="document.location = \'step'.$this->stepReach.'\'" title="Etape '.$this->stepReach.' : '.$this->step[$this->stepReach][0].'"><p>retour à étape '.$this->stepReach.'</p></div>'.
					  '<div id="EtapeValide" class="ButtonBigYellow">Modifier</div>';
			}
			else
			{
				if($this->stepCurrent > 1)
				{
					$foot .= '<div id="EtapePrecedent" onclick="document.location = \'step'.($this->stepCurrent-1).'\'" title="Etape '.($this->stepCurrent-1).' : '.$this->step[$this->stepCurrent-1][0].'"><p>Etape précédente</p></div>';
				}

				$foot .= '<div id="EtapeSuivant" title="Etape '.($this->stepCurrent+1).' : '.$this->step[$this->stepCurrent+1][0].'"><p>Etape suivante</p></div>';
			}

			$foot .= '<div id="EtapeAide" onclick="Ot.openPopup(\'aide/etape'.$this->stepCurrent.'.php\', \'560\', \'650\')" title="Aide"><p>Aide</p></div>';
		}

		return $foot.'<div class="clear"></div>';
	}
}

?>