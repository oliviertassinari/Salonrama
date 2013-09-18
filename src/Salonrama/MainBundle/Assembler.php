<?php

namespace Salonrama\MainBundle;

use Salonrama\MainBundle\File;
use Salonrama\MainBundle\Rand;

class Assembler
{
	private $pathSiteBack;
	private $pathPublic;
	private $LocHomeTheme;
	private $LocSiteHome;

	private $BlockList;
	private $DataList;
	private $ImageList;
	private $ThemeAct;
	private $PageList;

	private $PageNomList;

	private $Js = '';
	private $JsIniti = '';
	private $Php = '';
	private $File = array();
	private $BlockListWidth;

	private $Num = '';

	private $BlockObjHeightLast;

	public function __construct($pathSiteBack, $BlockList, $DataList, $ImageList, $ThemeAct, $PageList, $Num)
	{
		$this->LocSiteHome = '../../../../';
		$this->pathSiteBack = $pathSiteBack;
		$this->BlockList = json_decode($BlockList, true);
		$this->DataList = json_decode($DataList, true);
		$this->ImageList = json_decode($ImageList, true);
		$this->ThemeAct = $ThemeAct;
		$this->PageList = json_decode($PageList, true);

		$this->Num = $Num;

		if($_SERVER['SERVER_NAME'] == '127.0.0.1'){
			$this->pathPublic = 'http://127.0.0.1/bundles/salonramamain/';
		}
		else{
			$this->pathPublic = 'http://www.salonrama.fr/bundles/salonramamain/';
		}

		$this->LocHomeTheme = 'site/theme/'.$this->ThemeAct.'/';

		$this->PageNomList = $this->getPageNomList();

		require_once('../src/Salonrama/MainBundle/Resources/public/theme/'.$this->ThemeAct.'/theme.php');

		$this->BlockListWidth = eval('return '.$this->ThemeAct.'::$BlockListWidth;');

		if($this->pathSiteBack != '' && stripos($this->pathSiteBack, 'site/step/') === 0)
		{
			File::emptyFolderFile($this->pathSiteBack);

			$IndexHtml = ''.
'<?php

if(isset($_GET["page"]) && $_GET["page"] != "")
{
	switch($_GET["page"])
	{
';
			for($i = 0; $i < sizeof($this->PageList); $i++)
			{
				$id = $this->PageList[$i]['id'];
				$name = $this->PageList[$i]['name'];
				
				$PageNom = $this->PageNomList[$id].'.php';

				$Menu = $this->getMenu($id);
				$Structure = eval('return '.$ThemeAct.'::$Structure;');
				$Structure = str_replace('<div id="ThemeMenu"></div>', '<div id="ThemeMenu">'.$Menu.'</div>', $Structure);
				$Structure = $this->setDataVar($Structure);

				$BlockListHtml = $this->getBlockList($this->BlockList[$id]);
				$PageHtml = $this->getPageHtml($name.' - '.$this->DataList['Nom'], $Structure);
				$PageHtml = str_replace('<div id="ThemeBlockList"></div>', '<div id="ThemeBlockList">'.$BlockListHtml.'</div>', $PageHtml);

				File::addFile($PageHtml, $this->pathSiteBack.$PageNom);

				$IndexHtml .= 'case "'.$id.'": header("location:'.$PageNom.'"); break;';
			}

		$IndexHtml .= '
	}
}
else
{
	header("location:'.$this->PageNomList['index'].'.php");
}

?>';
			File::addFile($IndexHtml, $this->pathSiteBack.'index.php');
		}
	}

	public function getPageNomList()
	{
		$PageNomList = array();

		for($j = 0; $j < sizeof($this->PageList); $j++)
		{
			$id = $this->PageList[$j]['id'];
			$name = $this->PageList[$j]['name'];
			$name = strtolower($name);
			$name = str_replace(' ', '_', $name);

			$i = 1;

			do
			{
				if($i > 1){
					$name .= $i;
				}

				$i++;
			}
			while(in_array($name, $PageNomList) || $name == 'index');

			$PageNomList[$id] = $name;
		}
		
		return $PageNomList;
	}

	public function getMenu($PageAct)
	{
		$Html = '<ul>';

		for($i = 0; $i < sizeof($this->PageList); $i++)
		{
			$id = $this->PageList[$i]['id'];
			$name = $this->PageList[$i]['name'];

			if($id == $PageAct){
				$More = ' class="ThemeMenuAct"';
			}
			else{
				$More = '';
			}

			$Html .= '<li><a'.$More.' href="'.$this->PageNomList[$id].'.php">'.$name.'</a></li>';
		}

		return $Html.'</ul>';
	}

	public function setDataVar($Structure)
	{
		preg_match_all('/>Data(\w*)</sU', $Structure, $FoundList, PREG_SET_ORDER);

		foreach($FoundList as $var)
		{
			$Type = $var[1];

			if(isset($this->DataList[$Type]))
			{
				$Structure = str_replace('Data'.$Type, $this->DataList[$Type], $Structure);
			}
		}

		return $Structure;
	}

	public function getPageHtml($Titre, $Structure)
	{
		$Html = ''.

'<?php

'.$this->Php.'

?>
<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="utf-8">
	<link rel="shortcut icon" href="'.$this->pathPublic.'images/favicon.ico"/>

	<title>'.$Titre.'</title>

	<link rel="stylesheet" href="'.$this->pathPublic.'buildsite/general.css"/>
	<link rel="stylesheet" href="'.$this->pathPublic.'theme/theme.css"/>
	<link rel="stylesheet" href="'.$this->pathPublic.'buildsite/block.css"/>
	<link rel="stylesheet" href="'.$this->pathPublic.'theme/'.$this->ThemeAct.'/theme.css"/>

	'.$this->getFile().'

	<script>

		'.$this->Js.'

		function Initialisation()
		{
			'.$this->JsIniti.'
		}

	</script>

</head>

<body onload="Initialisation()" id="Theme">

'.$Structure.'

<?php include("'.$this->LocSiteHome.'src/Salonrama/MainBundle/Resources/views/Main/google_analytics.html.twig"); ?>

</body>
</html>';

		$this->Js = '';
		$this->JsIniti = '';
		$this->Php = '';

		return $Html;
	}

	public function getBlockList($BlockList)
	{
		$Html = '';

		foreach($BlockList as $Block)
		{
			$Html .= $this->getBlock($Block);
		}

		if($Html == '')
		{
			$Html = '<div class="BlockVide">Cette page est vide.</div>';
		}

		return $Html;
	}

	public function getBlock($Block)
	{
		$Html = '';
		$Type = $Block['T'];

		if($Type == 'Wys')
		{
			$V = $Block['V'];
			$V = $this->setLien($V);

			$Html .= $this->getBlockObj($V, $Block, 'ModuleWys');
		}
		else if($Type == 'Html')
		{
			$Html .= $this->getBlockObj($Block['V'], $Block);
		}
		else if($Type == 'Image')
		{
			$ImageInfo = $this->getImageInfo($Block['V']);
			$Html .= $this->getBlockObj('<div class="ModuleImage"><img src="'.$ImageInfo['src'].'" alt="photo" height="100%"/></div>', $Block);
		}
		else if(substr($Type, 0, 4) == 'Inte')
		{
			$Html .= $this->getBlockObjInte($Block);
		}
		else if($Type == 'BlockColone')
		{
			$Html .= $this->getBlockColone($Block['V'][0], $Block['V'][1]);
		}
		else if(substr($Type, 0, 6) == 'Module')
		{
			if(method_exists($this, eval('return "getBlock'.$Type.'";'))) // Si existe
			{
				$BlockModule = eval('return $this->getBlock'.$Type.'($Block[\'V\']);');

				$Html .= $this->getBlockObj($BlockModule, $Block);
			}
		}

		return $Html;
	}

	public function getBlockObj($Con, $Block, $Class = '', $Id = '')
	{
		$Height = $Block['P'][0];
		$Width = round(($Block['P'][1] / 100) * $this->BlockListWidth);

		$this->BlockObjHeightLast = $Height;

		if($Class != ''){
			$More = ' '.$Class.'"';
		}
		else if($Id != ''){
			$More .= ' id="'.$Id.'"';
		}
		else{
			$More = '"';
		}

		if(isset($Block['P'][2]))
		{
			$left = round(($Block['P'][2] / 100) * $this->BlockListWidth);
			return '<div class="Block'.$More.' style="width:'.$Width.'px; left:'.$left.'px;"><div class="BlockCon" style="height:'.$Height.'px;">'.$Con.'</div></div>';
		}
		else
		{
			return '<div class="Block'.$More.' style="width:'.$Width.'px;"><div class="BlockCon" style="height:'.$Height.'px;">'.$Con.'</div></div>';
		}
	}

	public function getBlockColone($Block1, $Block2)
	{
		$BlockObjHtml1 = $this->getBlock($Block1);
		$BlockObjHeight1 = $this->BlockObjHeightLast;

		$BlockObjHtml2 = $this->getBlock($Block2);
		$BlockObjHeight2 = $this->BlockObjHeightLast;

		$BlockObjHeightMax = max($BlockObjHeight1, $BlockObjHeight2);

		return '<div class="BlockColone" style="height:'.$BlockObjHeightMax.'px">'.$BlockObjHtml1.$BlockObjHtml2.'</div>';
	}

	public function getBlockObjInte($Block)
	{
		$Html = eval('return '.$this->ThemeAct.'::getInteHtml($Block["T"]);');
		$DataNbr = 0;
		$WysNbr = 0;

		if(isset($Block['V']['Image']))
		{
			$ImageInfo = $this->getImageInfo($Block['V']['Image']);

			$Html = str_replace('><div class="InteImage"></div><', '><div class="InteImage"><img src="'.$ImageInfo['src'].'" width="100%" alt="photo"/></div><', $Html);
		}

		if(isset($Block['V']['Data']))
		{
			preg_match_all('/>Data</sU', $Html, $DataList, PREG_SET_ORDER);
			foreach($DataList as $var)
			{
				$Html = preg_replace('/>Data</sU', '>'.$this->iisset($Block['V']['Data'], $DataNbr).'<', $Html, 1);
				$DataNbr++;
			}
		}

		if(isset($Block['V']['Wys']))
		{
			preg_match_all('/>Wys</sU', $Html, $WysList, PREG_SET_ORDER);
			foreach($WysList as $var)
			{			
				$V = $this->iisset($Block['V']['Wys'], $WysNbr);
				$V = $this->setLien($V);

				$Html = preg_replace('/>Wys</sU', '><div class="ModuleWys">'.$V.'</div><', $Html, 1);
				$WysNbr++;
			}
		}

		return $this->getBlockObj($Html, $Block);
	}

	public function getImageInfo($Nom)
	{
		if(isset($this->ImageList[$Nom]))
		{
			return array('src' => 'upload/'.$Nom, 'w' => $this->ImageList[$Nom][0], 'h' => $this->ImageList[$Nom][1]);
		}
		else
		{
			return array('src' => $this->pathPublic.'buildsite/image/image_nofound.png', 'w' => 320, 'h' => 240);
		}
	}

	public function getImageSizeOpt($ActW, $ActH, $OptW, $OptH)
	{
		$testH = round(($OptW / $ActW) * $ActH);
		$testW = round(($OptH / $ActH) * $ActW);

		if($testH > $OptH){ 
			$OptW = $testW; 
		}
		else{
			$OptH = $testH; 
		}

		return array('h' => $OptH, 'w' => $OptW);
	}

	public function iisset($Var, $Index)
	{
		if(isset($Var[$Index])){
			return $Var[$Index];
		}
		else{
			return 'Text';
		}
	}

	public function setLien($Html)
	{
		preg_match_all('/href="salonrama:\/\/(\w*)"/sU', $Html, $FoundList, PREG_SET_ORDER);

		foreach($FoundList as $var)
		{
			$Page = $var[1];

			if(isset($this->PageNomList[$Page]))
			{
				$Html = str_replace('href="salonrama://'.$Page.'"', 'href="'.$this->PageNomList[$Page].'.php"', $Html);
			}
			else
			{
				$Html = str_replace('href="salonrama://'.$Page.'"', 'href="#" onclick="alert(\'Page supprimée\'); return false"', $Html);
			}
		}

		return $Html;
	}

	public function addFile($Url, $Type)
	{
		if(!isset($this->File[$Url]))
		{
			$this->File[$Url] = $Type;
		}
	}

	public function getFile()
	{
		$Html = '';

		foreach($this->File as $Url => $Type)
		{
			if($Type == 'Script'){
				$Html .= '
	<script src="'.$Url.'"></script>';
			}
			else if($Type == 'Style'){
				$Html .= '
	<link rel="stylesheet" href="'.$Url.'"/>';
			}
		}

		$this->File = array();

		return $Html;
	}

	public function getBlockModuleMap($V)
	{
		$this->addFile('http://maps.google.com/maps/api/js?sensor=false&language=fr', 'Script');
		$this->addFile($this->pathPublic.'buildsite/ot.js', 'Script');
		$this->addFile($this->pathPublic.'buildsite/module/map/googlemap.js', 'Script');
		$this->addFile($this->pathPublic.'buildsite/module/map/map.css', 'Style');
		$this->addFile($this->pathPublic.'buildsite/form.css', 'Style');

		$ClassId = 'v'.Rand::getId();
		$GoogleMapId = Rand::getId();

		$this->JsIniti .= "
			try{
				var ".$ClassId." = new GoogleMap('".$GoogleMapId."', 'voir');

				if(".$ClassId.".Map != ''){
					".$ClassId.".V = ".json_encode($V).";
					".$ClassId.".setV('All');
				}
				else{
					".$ClassId." = document.getElementById('".$GoogleMapId."');
					".$ClassId.".parentNode.style.height = '80px';
					".$ClassId.".firstChild.innerHTML = 'Le module Google Maps n\'est actuellement pas disponible.';
				}
			}
			catch(e){
				".$ClassId." = document.getElementById('".$GoogleMapId."');
				".$ClassId.".parentNode.style.height = '80px';
				".$ClassId.".firstChild.innerHTML = 'Le module Google Maps n\'est actuellement pas disponible.';
			}";

		return '<div id="'.$GoogleMapId.'" class="BlockWHFull"><div class="BlockVide">Chargement du module en cours...</div></div>';
	}

	public function getBlockModuleTab($V)
	{
		$this->addFile($this->pathPublic.'buildsite/module/tab/tab.css', 'Style');

		$Col1 = $V['Col1'];
		$Col2 = $V['Col2'];
		$Col1Width = round(($V['Len'][0]/100) * $this->BlockListWidth);
		$Col2Width = round(($V['Len'][1]/100) * $this->BlockListWidth);

		$x = 0;
		$isFirst = true;
		$Html = '<h2 class="ModuleTabTitre">'.$V['Titre'].'</h2>'.
				'<table class="ModuleTabTable">';

		foreach($Col1 as $cle => $var)
		{
			if($isFirst == true)
			{
				$isFirst = false;
				$Class = 'ModuleTabColHead ModuleTabCenter';
			}
			else
			{
				if($x == 0){
					$Class = 'ModuleTabCol0';
					$x = 1;
				}
				else{
					$Class = 'ModuleTabCol1';
					$x = 0;
				}
			}

			$Html .= '<tr class="'.$Class.'">'.
						'<td style="width:'.$Col1Width.'px">'.$Col1[$cle].'</td>'.
						'<td style="width:'.$Col2Width.'px" class="ModuleTabCenter">'.$Col2[$cle].'</td>'.
					'</tr>';
		}

		$Html .= '</table>';

		return $Html;
	}

	public function getBlockModuleGalerie($V)
	{
		$Type = $V['Type'];
		$ImageList = $V['ImageList'];
		$Html = '';
		$Id = Rand::getId();
		$ClassId = Rand::getId();

		if($Type == 'MilkBox')
		{
			$this->addFile($this->pathPublic.'buildsite/mootools.js', 'Script');
			$this->addFile($this->pathPublic.'buildsite/module/galerie/milkbox.js', 'Script');
			$this->addFile($this->pathPublic.'buildsite/module/galerie/milkbox.css', 'Style');
			$this->addFile($this->pathPublic.'buildsite/module/galerie/galerie.css', 'Style');

			foreach($ImageList as $Nom)
			{
				$ImageInfo = $this->getImageInfo($Nom);
				$ImageSizeOpt = $this->getImageSizeOpt($ImageInfo['w'], $ImageInfo['h'], 150, 150);

				$Html .= '<div class="ModuleGalerieImage">'.
							'<a href="'.$ImageInfo['src'].'" class="MMilkBox" title="Agrandir cette image"><img src="'.$ImageInfo['src'].'" alt="photo" width="'.$ImageSizeOpt['w'].'" height="'.$ImageSizeOpt['h'].'"/><span class="Zoom"></span></a>'.
						'</div>';
			}
			$Html .= '<div class="Clear"></div>';

			$this->JsIniti .= "
			var ".$ClassId." = new MilkBox();
			".$ClassId.".prepareGalleries(document.getElementById('".$Id."'));
			";
		}
		else if($Type == 'MooFlow')
		{
			$this->addFile($this->pathPublic.'buildsite/mootools.js', 'Script');
			$this->addFile($this->pathPublic.'buildsite/module/galerie/milkbox.js', 'Script');
			$this->addFile($this->pathPublic.'buildsite/module/galerie/milkbox.css', 'Style');
			$this->addFile($this->pathPublic.'buildsite/module/galerie/mooflow.js', 'Script');
			$this->addFile($this->pathPublic.'buildsite/module/galerie/mooflow.css', 'Style');

			$master = array();

			foreach($ImageList as $Nom)
			{
				$ImageInfo = $this->getImageInfo($Nom);
				array_push($master, array('href' => $ImageInfo['src'], 'src' => $ImageInfo['src']));
			}

			$master = json_encode($master);

			$this->JsIniti .= "
			var Galerie = new MilkBox();

			".$ClassId." = new MooFlow($(document.getElementById('".$Id."')), {
				useSlider: true,
				useCaption: true,
				useMouseWheel: true,
				useKeyInput: true,
				useViewer: true,
				onClickView: function(obj){ Galerie.showThisImage(obj.href, ''); }
			});

			".$ClassId.".master = {'images':".$master."};
			".$ClassId.".clearMain();
			";
		}

		return '<div id="'.$Id.'">'.$Html.'</div>';
	}

	public function getBlockModuleForm($V)
	{
		if($V['email'] == '')
		{
			return '<div class="BlockVide">Module contact désactivé : aucune e-mail de destination</div>';
		}

		$this->addFile($this->pathPublic.'buildsite/ot.js', 'Script');
		$this->addFile($this->pathPublic.'buildsite/form.js', 'Script');
		$this->addFile($this->pathPublic.'buildsite/form.css', 'Style');
		$this->addFile($this->pathPublic.'buildsite/button.css', 'Style');
		$this->addFile($this->pathPublic.'buildsite/cadre.css', 'Style');
		$this->addFile($this->pathPublic.'buildsite/module/form/form.css', 'Style');

		$ClassId = Rand::getId();
		$FonctionId = Rand::getId();
		$EtatId = Rand::getId();
		$FormId = Rand::getId();

		$this->Php .= '
require_once("'.$this->LocSiteHome.'creator/module/form/form.php");
require_once("'.$this->LocSiteHome.'php/GForm.php");

$'.$FonctionId.' = create_function(\'$Class, $R\', \'

if($R == 0)
{
	if("'.$this->Num.'" != "")
	{
		if(EmailModuleForm("'.$this->LocSiteHome.'", "'.$this->Num.'") === true)
		{
			$Class->getEtatHtml(true, "Votre message a bien été envoyé.<br/>Nous traiterons votre demande dans les plus brefs délais.", "'.$EtatId.'");
		}
		else
		{
			$Class->getEtatHtml(false, "Echec lors de l\\\'envoi de l\\\'e-mail", "'.$EtatId.'");
		}
	}
	else
	{
		$Class->getEtatHtml(false, "Votre e-mail n\\\'a pas été envoyé : module desactivé pendant la création du site.", "'.$EtatId.'");
	}
}
else if($R == 1)
{
	$Class->getEtatHtml(false, "Champ Invalide", "'.$EtatId.'");
}
else
{
	$Class->getEtatHtml(false, "Champs Invalides", "'.$EtatId.'");
}

\');

$'.$ClassId.' = new GForm("'.$this->pathPublic.'", $'.$FonctionId.');';

		$this->Js .= "var ".$ClassId.";

		function ".$FonctionId."(R)
		{
			var FormEtat = document.getElementById('".$EtatId."');

			".$ClassId.".setFormEtat(FormEtat, '', '');
			new Fx(FormEtat, { From: 0, To: 1, Mode: 'opacity' });

			if(R == 0)
			{
				".$ClassId.".setFormEtat(FormEtat, 'load', 'Envoye en cours...');
				document.getElementById('".$FormId."').submit();
			}
			else if(R == 1){ ".$ClassId.".setFormEtat(FormEtat, false, 'Champ Invalide.'); }
			else{ ".$ClassId.".setFormEtat(FormEtat, false, 'Champs Invalides.'); }
		}";

		$this->JsIniti .= "
			".$ClassId." = new GForm('".$this->pathPublic."', ".$FonctionId.");";

		$isObligatoire = false;
		$Html = '<form method="post" action="?#'.$FormId.'" id="'.$FormId.'">'.
'<?php

ob_start();
$'.$ClassId.'->getEtat();
$tempon = ob_get_contents();
ob_end_clean();

if(strpos($tempon, "CadColor CadVert"))
{
	echo $tempon;
}
else
{

?>'.
				'<div class="ModuleForm">'.
					'<div class="ModuleFormChampList">';

		foreach($V['ChampList'] as $Info)
		{
			$ChampId = Rand::getId();
			$Type = $Info[0];
			$Var = $Info[1];
			$Name = $ChampId.'_'.$Var;
			$Name = str_replace(' ', '_', $Name);

			if($Info[2] == 1){
				$Label = $Var.'<span class="etoile">*</span>:';
				$isObligatoire = true;
				$Facul = 'false';
			}
			else{
				$Label = $Var.' :';
				$Facul = 'true';
			}

			$Html .= '<div class="FormChamp">'.
						'<label class="FormLabel" for="'.$ChampId.'">'.$Label.'</label>';

			if($Type == 'text' || $Type == 'email'){
				$Html .= '<input class="FormInputText" type="text" size="35" id="'.$ChampId.'" name="'.$Name.'" <?php $'.$ClassId.'->getValue("'.$Name.'"); ?>/>'.
						 '<?php $'.$ClassId.'->getChampErr("'.$Name.'"); ?>';
			}
			else if($Type == 'textarea'){
				$Html .= '<?php $'.$ClassId.'->getChampErr("'.$Name.'"); ?>'.
						 '<textarea class="FormTexta" rows="8" cols="80" id="'.$ChampId.'" name="'.$Name.'"><?php $'.$ClassId.'->getTexta("'.$Name.'"); ?></textarea>';
			}

			$Html .= '</div>';

			if($Type == 'email')
			{
				$this->JsIniti .= "
			".$ClassId.".addChamp('Input', document.getElementById('".$ChampId."'), { RegExp: 'email', Facul: ".$Facul."  });";
				$this->Php .= '
$'.$ClassId.'->addChamp("Input", "'.$Name.'", array("RegExp" => "email"));';
			}
			else if($Type == 'textarea')
			{
				$this->JsIniti .= "
			".$ClassId.".addChamp('Texta', document.getElementById('".$ChampId."'), { Facul: ".$Facul." });";
				$this->Php .= '
$'.$ClassId.'->addChamp("Texta", "'.$Name.'", array());';
			}
			else
			{
				$this->JsIniti .= "
			".$ClassId.".addChamp('Input', document.getElementById('".$ChampId."'), { Facul: ".$Facul." });";
				$this->Php .= '
$'.$ClassId.'->addChamp("Input", "'.$Name.'", array());';
			}
		}

		if($isObligatoire == true){
			$Style = 'block';
		}
		else{
			$Style = 'none';
		}

		$Html .= 		'<input type="hidden" name="P_Email" value="'.$V['email'].'"/>'.
					'</div>'.
					'<div class="FormValid">'.
						'<?php $'.$ClassId.'->getEtat(); ?>'.
						'<div id="'.$EtatId.'"></div>'.
						'<button type="submit" class="ButtonSmallGreen" onclick="'.$ClassId.'.Valide(); return false;">'.
							'<img src="'.$this->pathPublic.'image/icone/ok.png"/>Envoyer mon message'.
						'</button>'.
					'</div>'.
					'<p class="etoile" style="display:'.$Style.'">* champ à remplir obligatoirement</p>'.
				'</div>'.
				'<?php } ?>'.
				'</form>';

		return $Html;
	}
}

?>