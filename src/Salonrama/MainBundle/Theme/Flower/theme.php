<?php

class Flower
{

public static $BlockListWidth = 910;

public static $Structure = '<div id="ThemeFixe">
	<div id="ThemeHead">
		<h1 id="ThemeNom">DataNom</h1>
		<h2 id="ThemeSlogan">DataSogan</h2>
		
		
	</div>
	
	<div id="ThemeMenu"></div>

	<div id="ThemeCon">
		<div id="ThemeBlockList"></div>
	</div>

	<div id="ThemeFoot">DataFoot</div>

	<div class="SalonramaB">site créé avec <a href="http://www.salonrama.fr/" target="_blank">Salonrama</a></div>
</div>';

public static function getInteHtml($Type)
{
	$Html = '';

	if($Type == 'InteTitre'){
		$Html = '<div class="InteTitre"><h2 class="InteModuleTitre">Data</h2></div>';
	}
	else if($Type == 'InteDecouvrir'){
		$Html = '<div class="InteDecouvrir"><h2 class="InteModuleTitre">Data</h2><div class="InteModuleCon">Wys</div></div>';
	}
	else if($Type == 'IntePlan'){
		$Html = '<div class="IntePlan"><h2 class="InteModuleTitre">Data</h2><div class="InteModuleCon"><div class="InteImage"></div></div></div>';
	}
	else if($Type == 'InteHoraire'){
		$Html = '<div class="InteHoraire"><h2 class="InteModuleTitre">Data</h2><div class="InteModuleCon"><div class="InteHoraireCon"><ul><li><strong>Lundi</strong></li><li>Wys</li></ul><ul><li><strong>Mardi</strong></li><li>Wys</li></ul><ul><li><strong>Mercredi</strong></li><li>Wys</li></ul><div class="Clear"></div><ul><li><strong>Jeudi</strong></li><li>Wys</li></ul><ul><li><strong>Vendredi</strong></li><li>Wys</li></ul><ul><li><strong>Samedi</strong></li><li>Wys</li></ul><div class="Clear"></div><ul><li><strong>Dimanche</strong></li><li>Wys</li></ul><div class="Clear"></div></div></div></div>';
	}
	else if($Type == 'InteContact'){
		$Html = '<div class="InteContact"><h2 class="InteModuleTitre">Data</h2><div class="InteModuleCon"><div class="InteContactCon"><ul class="InteContactTelephone"><li><strong>Téléphone</strong></li><li>Data</li></ul><ul class="InteContactEmail"><li><strong>Adresse</strong></li><li>Data</li></ul><ul class="InteContactEmail"><li><strong>E-mail</strong></li><li>Data</li></ul><div class="Clear"></div></div></div></div>';
	}
	else if($Type == 'InteInfoSup'){
		$Html = '<div class="InteInfoSup"><h2 class="InteModuleTitre">Data</h2><div class="InteModuleCon">Wys</div></div>';
	}

	return $Html;
}

}

?>