<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Salonrama\MainBundle\Buildsite;
use Salonrama\MainBundle\File;

class Step2Controller extends Controller
{
    public function step2Action()
    {
        $request = $this->getRequest();
        $session = $request->getSession();

		$buildsite = new Buildsite($session, 2);
		$storyboard = $buildsite->getStoryboard();
		$foot = $buildsite->getFoot();
        $message = '';

        if($request->isMethod('POST'))
        {
            $session->set('buildsite/salon/name', $request->request->get('salon-name'));

            if($request->request->get('salon-women-allowed'))
            {
                $session->set('buildsite/salon/womenAllowed', true);
            }
            else
            {
                $session->set('buildsite/salon/womenAllowed', false);
            }

            if($request->request->get('salon-men-allowed'))
            {
                $session->set('buildsite/salon/menAllowed', true);
            }
            else
            {
                $session->set('buildsite/salon/menAllowed', false);
            }

            $session->set('buildsite/salon/address', $request->request->get('salon-address'));
            $session->set('buildsite/salon/zipcode', $request->request->get('salon-zipcode'));
            $session->set('buildsite/salon/city', $request->request->get('salon-city'));
            $session->set('buildsite/salon/country', $request->request->get('salon-country'));
            $session->set('buildsite/salon/phone', $request->request->get('salon-phone'));
            $session->set('buildsite/salon/email', $request->request->get('salon-email'));
            $session->set('buildsite/salon/schedule', $request->request->get('salon-schedule'));

            $Nom = $session->get('buildsite/salon/name', 'Nom du Salon');
            $Telephone = $session->get('buildsite/salon/phone', 'Téléphone');
            $Email = $session->get('buildsite/salon/email', 'Email');
            $Adresse = $session->get('buildsite/salon/address', '').' '.$session->get('buildsite/salon/zipcode', '').' '.$session->get('buildsite/salon/city', '');
            $Foot = $session->get('buildsite/salon/name', '').' - '.$session->get('buildsite/salon/address', '').' - '.$session->get('buildsite/salon/phone', '');
            $Adresse = $session->get('buildsite/salon/address', 'Adresse');
            $Codepostal = $session->get('buildsite/salon/zipcode', 'Code-postal');
            $ville = $session->get('buildsite/salon/city', 'Ville');
            $pays = $session->get('buildsite/salon/country', 'Pays');

            $session->set('buildsite/site/dataList', '{
                "Nom": "'.$Nom.'",
                "Sogan": "Salon de coiffure - '.$ville.'",
                "Telephone": "'.$Telephone.'",
                "Email": "'.$Email.'",
                "Adresse": "'.$Adresse.'",
                "Foot": "'.$Foot.'"
            }');

            $LatLon = $this->getLatLon($Adresse);

            if($LatLon['lon'] != 0){
                $ModuleMap = '["'.$Adresse.'", '.$LatLon['lat'].', '.$LatLon['lon'].', 15, "plan", '.$LatLon['lat'].', '.$LatLon['lon'].', "'.$LatLon['adresse'].'"]';
            }
            else{
                $ModuleMap = '["'.$Adresse.'", 0, 0, 4, "plan", 47.219568, 1.582031, ""]';
            }

            $R = '';
            if($session->get('buildsite/salon/womenAllowed') == true)
            {
                $R .= '{"T": "ModuleTab", "V": { "Titre": "Femmes", "Col1": ["Forfaits","Shampooing Coiffage ou Mise en plis","Shampooing Soin Coupe Coiffage","Couleur Shampooing Soin Coupe Coiffage","Permanente Shampooing Soin Coupe Coiffage","Mèches Shampooing Soin Coupe Coiffage","Mèches 2 Couleurs Shampooing Soin Coupe Coiffage"], "Col2": ["Tarifs","16 €","28 €","48 €","50 €","60 €","70 €"], "Len": [50, 10] }, "P": [200, 100, 0] },';
            }
            if($session->get('buildsite/salon/menAllowed') == true)
            {
                $R .= '{"T": "ModuleTab", "V": { "Titre": "Hommes", "Col1": ["Forfaits","Shampooing Coupe Coiffage","Couleur Shampooing Coupe Coiffage","Permanente Shampooing Coupe Coiffage"], "Col2": ["Tarifs","17 €","36 €","36 €"], "Len": [50, 10] }, "P": [130, 100, 0] },';
            }
            if($R == '')
            {
                $R .= '{"T": "ModuleTab", "V": { "Titre": "Titre", "Col1": ["Forfaits","","", ""], "Col2": ["Tarifs"," €"," €"," €"], "Len": [50, 10] }, "P": [130, 100, 0]},';
            }
            $ModuleTarif = substr($R, 0, strlen($R)-1);

            $session->set('buildsite/site/pageList', '[{ "id": "index", "name": "Accueil" }, { "id": "2222", "name": "Galerie photos" }, { "id": "3333", "name": "Plan d\'accès" }, { "id": "4444", "name": "Nos tarifs" }, { "id": "5555", "name": "Nous contacter" }]');
            $session->set('buildsite/site/imageList', '{ "photo.jpg": [300, 200], "plan.jpg": [248, 198], "photo2.jpg": [283, 424], "photo3.jpg": [292, 412] }');
            $session->set('buildsite/site/blockList', '{
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
                                    "Wys": "'.$this->getHoraireHtml($session->get('buildsite/salon/schedule')).'",
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
                        $Codepostal.' '.$ville.', '.$pays.
                        '<br/>Tél: '.$Telephone.
                        '<br/>E-mail: '.$Email.
                        '<br/><br/>N\'hésitez pas non plus à poser vos questions via le formulaire ci-dessous.</div><br/><br/><font size=\"5\"><strong>Nous contacter</strong></font>", "P": [220, 100, 0] },
                    { "T": "ModuleForm", "V": {
                        "email": "'.$session->get('buildsite/salon/email', '').'",
                        "ChampList": [["text","Nom",1], ["email","Mon adresse e-mail",1], ["text","Sujet",1], ["textarea","Message",1]]
                    }, "P": [430, 100, 0]}
                ]
            }');

            if($buildsite->stepReach == 2)
            {
                $session->set('buildsite/stepReach', 3);

                File::copyFolder('../src/Salonrama/MainBundle/Site/default/', $session->get('buildsite/site/loc').'upload/');

                return $this->redirect($this->generateUrl('salonrama_main_buildsite_step3'));
            }
            else
            {
                $message = 'Votre site a été régénéré.';
            }
        }

        $salon = array(
            'name' => $session->get('buildsite/salon/name', ''),
            'womenAllowed' => $session->get('buildsite/salon/womenAllowed', true),
            'menAllowed' => $session->get('buildsite/salon/menAllowed', true),
            'address' => $session->get('buildsite/salon/address', ''),
            'zipcode' => $session->get('buildsite/salon/zipcode', ''),
            'city' => $session->get('buildsite/salon/city', ''),
            'country' => $session->get('buildsite/salon/country', ''),
            'phone' => $session->get('buildsite/salon/phone', ''),
            'email' => $session->get('buildsite/salon/email', ''),
            'schedule' => $session->get('buildsite/salon/schedule', '["0",["9h00","12h30","13h00","19h00"],["9h00","12h30","13h00","19h00"],["9h00","12h30","13h00","19h00"],["9h00","12h30","13h00","19h00"],["9h00","18h00"],"0"]')
        );

		return $this->render('SalonramaMainBundle:Buildsite:step2.html.twig', array(
        																		'storyboard' => $storyboard,
        																		'foot' => $foot,
                                                                                'salon' => $salon,
                                                                                'message' => $message
        																		));
    }

    public function getLatLon($Adresse) 
    {
        $Geo['lon'] = 0;
        $Geo['lat'] = 0;
        $Geo['adresse'] = '';

        if($Adresse != '')
        {
            if($Reponse = file_get_contents(sprintf('http://maps.googleapis.com/maps/api/geocode/json?address=%s&sensor=false', rawurlencode($Adresse))))
            {
                $Reponse = json_decode($Reponse, true);

                if($Reponse['status'] == 'OK')
                {
                    $Etat = $Reponse['results'][0];

                    $Geo['adresse'] = $Etat['formatted_address'];
                    $Geo['lat'] = $Etat['geometry']['location']['lat'];
                    $Geo['lon'] = $Etat['geometry']['location']['lng'];
                }
            }
        }

        return $Geo;       
    }

    public function getHoraireHtml($Horaire)
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