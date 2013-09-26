<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

class SiteData
{
	public static function get($salon)
	{
		$data = array();

        $Nom = self::v($salon['name'], 'Nom du Salon');
        $Telephone = self::v($salon['phone'], 'Téléphone');
        $Email = self::v($salon['email'], 'Email');
        $Adresse = self::v($salon['address'], '').' '.self::v($salon['zipcode'], '').' '.self::v($salon['city'], '');

        $location = self::getLocation($Adresse);

        $Adresse = self::v($salon['address'], 'Adresse');
        $ville = self::v($salon['city'], 'Ville');
        $pays = self::v($salon['country'], 'Pays');

        $data['dataList'] = '{
            "Nom": "'.$Nom.'",
            "Sogan": "Salon de coiffure - '.$ville.'",
            "Telephone": "'.$Telephone.'",
            "Email": "'.$Email.'",
            "Adresse": "'.$Adresse.'",
            "Foot": "'.self::v($salon['name'], '').' - '.self::v($salon['address'], '').' - '.self::v($salon['phone'], '').'"
        }';

        if($location['lon'] != 0){
            $ModuleMap = '["'.$Adresse.'", '.$location['lat'].', '.$location['lon'].', 15, "plan", '.$location['lat'].', '.$location['lon'].', "'.$location['address'].'"]';
        }
        else{
            $ModuleMap = '["'.$Adresse.'", 0, 0, 4, "plan", 47.219568, 1.582031, ""]';
        }

        $ModuleTarif = '';
        if($salon['womenAllowed'] == true)
        {
            $ModuleTarif .= '{"T": "ModuleTab", "V": { "Titre": "Femmes", "Col1": ["Forfaits","Shampooing Coiffage ou Mise en plis","Shampooing Soin Coupe Coiffage","Couleur Shampooing Soin Coupe Coiffage","Permanente Shampooing Soin Coupe Coiffage","Mèches Shampooing Soin Coupe Coiffage","Mèches 2 Couleurs Shampooing Soin Coupe Coiffage"], "Col2": ["Tarifs","16 €","28 €","48 €","50 €","60 €","70 €"], "Len": [50, 10] }, "P": [200, 100, 0] },';
        }
        if($salon['menAllowed'] == true)
        {
            $ModuleTarif .= '{"T": "ModuleTab", "V": { "Titre": "Hommes", "Col1": ["Forfaits","Shampooing Coupe Coiffage","Couleur Shampooing Coupe Coiffage","Permanente Shampooing Coupe Coiffage"], "Col2": ["Tarifs","17 €","36 €","36 €"], "Len": [50, 10] }, "P": [130, 100, 0] },';
        }
        if($salon['childrenAllowed'] == true)
        {
            $ModuleTarif .= '{"T": "ModuleTab", "V": { "Titre": "Jeunes", "Col1": ["Forfaits","Jeunes","Étudiant", "Etudiante"], "Col2": ["Tarifs","12 €","15 €","22 €"], "Len": [50, 10] }, "P": [130, 100, 0]},';
        }
        if($ModuleTarif == '')
        {
            $ModuleTarif .= '{"T": "ModuleTab", "V": { "Titre": "Titre", "Col1": ["Forfaits","","", ""], "Col2": ["Tarifs"," €"," €"," €"], "Len": [50, 10] }, "P": [130, 100, 0]},';
        }
        $ModuleTarif = substr($ModuleTarif, 0, strlen($ModuleTarif)-1);

       	$data['pageList'] = '[{ "id": "index", "name": "Accueil" }, { "id": "2222", "name": "Galerie photos" }, { "id": "3333", "name": "Plan d\'accès" }, { "id": "4444", "name": "Nos tarifs" }, { "id": "5555", "name": "Nous contacter" }]';
        $data['imageList'] = '{ "photo.jpg": [300, 200], "plan.jpg": [248, 198], "photo2.jpg": [283, 424], "photo3.jpg": [292, 412] }';
       	$data['blockList'] = '{
            "index":[
                { "T": "InteTitre", "V": {
                        "Data": ["Bienvenue !"]
                    }, "P": [55, 100, 0]
                },
                { "T": "BlockColone", "V": [
                        { "T": "Image", "V": "photo.jpg", "P": [200, 50, 0] },
                        {"T": "InteDecouvrir", "V": {
                            "Wys": ["A chaque forme de visage correspond une coupe de cheveux. Découvrez celle qui vous mettra en valeur,grâce aux conseils de nos coiffeuses expérimentées qui sauront vous donner entière satisfaction."],"Data":["Découvrez notre salon"]
                        }, "P": [205, 50, 50] }
                    ]
                },
                { "T": "InteHoraire", "V": {
                                "Wys": '.self::getHoraireHtml($salon['schedule']).',
                                "Data": ["Horaire d\'ouverture"]
                            }, "P": [275, 59, 0]
                },
                { "T": "BlockColone", "V": [
                        { "T":"InteContact", "V": {
                                "Data": ["Nous contacter", "'.$Telephone.'", "'.$Adresse.'", "'.$Email.'"]
                            }, "P": [175, 59, 0]
                        },
                        { "T": "InteInfoSup", "V": {
                                "Wys": ["Notre salon de coiffure vous souhaite la bienvenue sur son site. Vous pourrez y trouver nos tarifs, le plan d\'accès... Nous sommes experts en la matière depuis 1990 et nous serons très heureux de vous accueillir dans une ambiance chaleureuse."],
                                "Data": ["Informations supplémentaires"]
                            }, "P": [175, 40, 60]
                        }
                    ]
                }
            ],
            "2222": [
                { "T": "Wys", "V": "<strong><font size=\"5\">Nos réalisations</font></strong>", "P": [50, 100, 0] },
                { "T": "ModuleGalerie", "V": { "Type": "MilkBox", "ImageList": ["photo2.jpg", "photo3.jpg"] }, "P": [200, 100, 0] }
            ],
            "3333": [
                { "T": "Wys", "V": "<strong><font size=\"5\">Comment y accéder ?</font></strong><br/><br/><strong>Adresse</strong> : '.$Adresse.'<br/><br/>Le salon est en face du collège Salonrama.<br/>En métro : Par la ligne 6 : Descendez à  la station \'Bel Air\'<br/>En bus : Prenez le bus numéro 2 et arrêtez vous à l\'arrêt Salonrama.", "P": [150, 100, 0] },
                { "T": "ModuleMap", "V": '.$ModuleMap.', "P": [350, 100, 0] }
            ],
            "4444": [
                '.$ModuleTarif.'
            ],
            "5555": [
                { "T": "Wys", "V": "<font size=\"5\"><strong>Nos coordonnées</strong></font><div align=\"center\"><strong>'.$Nom.'</strong><br/>'.
                    $Adresse.'<br/>'.
                    self::v($salon['zipcode'], 'Code-postal').' '.$ville.', '.$pays.
                    '<br/>Tél: '.$Telephone.
                    '<br/>E-mail: '.$Email.
                    '<br/><br/>N\'hésitez pas non plus à poser vos questions via le formulaire ci-dessous.</div><br/><br/><font size=\"5\"><strong>Nous contacter</strong></font>", "P": [220, 100, 0] },
                { "T": "ModuleForm", "V": {
                    "email": "'.self::v($salon['email'], '').'",
                    "ChampList": [["text","Nom",1], ["email","Mon adresse email",1], ["text","Sujet",1], ["textarea","Message",1]]
                }, "P": [430, 100, 0]}
            ]
        }';

		return $data;
	}

	public static function v($var, $default)
	{
		if(trim($var) == '')
		{
			return $default;
		}
		else
		{
			return $var;
		}
	}

    public static function getLocation($address) 
    {
        $location['lon'] = 0;
        $location['lat'] = 0;
        $location['address'] = '';

        if(trim($address) != '')
        {
            if($reponse = file_get_contents(sprintf('http://maps.googleapis.com/maps/api/geocode/json?address=%s&sensor=false', rawurlencode($address))))
            {
                $reponse = json_decode($reponse, true);

                if($reponse['status'] == 'OK')
                {
                    $Etat = $reponse['results'][0];

                    $location['address'] = $Etat['formatted_address'];
                    $location['lat'] = $Etat['geometry']['location']['lat'];
                    $location['lon'] = $Etat['geometry']['location']['lng'];
                }
            }
        }

        return $location;       
    }

    public static function getHoraireHtml($Horaire)
    {
        $HoraireList = json_decode($Horaire, true);
        $R = array();

        foreach($HoraireList as $cle => $var)
        {
            if($var == '0'){
                $R[$cle] = 'Fermé';
            }
            else{
                $M = 0;
                $R2 = '';

                foreach($HoraireList[$cle] as $var2)
                {
                    if($M == 0){
                        $M = 1;
                        $R2 .= $var2;
                    }
                    else if($M == 1){
                        $M = 2;
                        $R2 .= ' à '.$var2;
                    }
                    else{
                        $M = 1;
                        $R2 .= '<br>'.$var2;
                    }
                }

                $R[$cle] = $R2;
            }
        }

        return json_encode($R);
    }
}

?>