<?php

class Ciseau
{

public static $BlockListWidth = 728;

public static $Structure = '

<div id="ThemeFixe">
	<div id="ThemeCorpsTop">
	<div id="ThemeHead">
		<div id="Logo"></div>
		<h1 id="ThemeNom">DataNom</h1>
		<h2 id="ThemeSlogan">DataSogan</h2>
		<div id="ThemeMenu"></div>
	</div>

	<div id="ThemeCorps">


		<div id="ThemeCon">
			<div id="ThemeBlockList"></div>
		</div>
	</div>
	</div>


</div>

	<div id="ThemeFoot">DataFoot</div>

	<div class="SalonramaN">site créé avec <a href="http://www.salonrama.fr/" target="_blank">Salonrama</a></div>';

public static function getInteHtml($Type)
{
	$Html = '';

	if($Type == 'InteTitre'){
		$Html = '<div class="InteTitre"><h2>Data</h2></div>';
	}
	else if($Type == 'InteDecouvrir'){
		$Html = '<div class="InteDecouvrir InteModule"><h2 class="InteModuleTitre">Data</h2><p>Wys</p></div>';
	}
	else if($Type == 'IntePlan'){
		$Html = '<div class="IntePlan InteModule"><h2 class="InteModuleTitre">Data</h2><div class="InteImage"></div></div>';
	}
	else if($Type == 'InteHoraire'){
		$Html = '<div class="InteHoraire InteModule"><h2 class="InteModuleTitre">Data</h2><div class="InteHoraireCon"><ul><li><strong>Lundi</strong></li><li>Wys</li></ul><ul><li><strong>Mardi</strong></li><li>Wys</li></ul><ul><li><strong>Mercredi</strong></li><li>Wys</li></ul><div class="Clear"></div><ul><li><strong>Jeudi</strong></li><li>Wys</li></ul><ul><li><strong>Vendredi</strong></li><li>Wys</li></ul><ul><li><strong>Samedi</strong></li><li>Wys</li></ul><div class="Clear"></div><ul><li><strong>Dimanche</strong></li><li>Wys</li></ul><div class="Clear"></div></div></div>';
	}
	else if($Type == 'InteContact'){
		$Html = '<div class="InteContact InteModule"><h2 class="InteModuleTitre">Data</h2><div class="InteContactCon"><ul class="InteContactTelephone"><li><strong>Téléphone</strong></li><li>Data</li></ul><ul class="InteContactEmail"><li><strong>Adresse</strong></li><li>Data</li></ul><ul class="InteContactEmail"><li><strong>E-mail</strong></li><li>Data</li></ul><div class="Clear"></div></div></div>';
	}
	else if($Type == 'InteInfoSup'){
		$Html = '<div class="InteInfoSup InteModule"><h2 class="InteModuleTitre">Data</h2><p>Wys</p></div>';
	}

	return $Html;
}

}

?>