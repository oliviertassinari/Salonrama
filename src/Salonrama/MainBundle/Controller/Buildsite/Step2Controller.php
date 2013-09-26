<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Salonrama\MainBundle\Buildsite;
use Salonrama\MainBundle\File;
use Salonrama\MainBundle\Controller\Buildsite\SiteData;

class Step2Controller extends Controller
{
    public function step2Action()
    {
        $request = $this->getRequest();
        $session = $request->getSession();

		$buildsite = new Buildsite($session, 2);

        if(!$buildsite->isAllowed())
        {
            return $this->redirect($this->generateUrl('salonrama_main_buildsite_step'.$buildsite->getStepReach()));
        }

		$storyboard = $buildsite->getStoryboard();
		$foot = $buildsite->getFoot();
        $message = '';

        if($request->isMethod('POST'))
        {
            $session->set('buildsite/salon/name', trim($request->request->get('salon-name')));

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

            if($request->request->get('salon-children-allowed'))
            {
                $session->set('buildsite/salon/childrenAllowed', true);
            }
            else
            {
                $session->set('buildsite/salon/childrenAllowed', false);
            }

            $session->set('buildsite/salon/address', trim($request->request->get('salon-address')));
            $session->set('buildsite/salon/zipcode', trim($request->request->get('salon-zipcode')));
            $session->set('buildsite/salon/city', trim($request->request->get('salon-city')));
            $session->set('buildsite/salon/country', trim($request->request->get('salon-country')));
            $session->set('buildsite/salon/phone', trim($request->request->get('salon-phone')));
            $session->set('buildsite/salon/email', mb_strtolower(trim($request->request->get('salon-email')), 'UTF-8'));
            $session->set('buildsite/salon/schedule', $request->request->get('salon-schedule'));

            $salon = array(
                'name' => $session->get('buildsite/salon/name', ''),
                'womenAllowed' => $session->get('buildsite/salon/womenAllowed', true),
                'menAllowed' => $session->get('buildsite/salon/menAllowed', true),
                'childrenAllowed' => $session->get('buildsite/salon/childrenAllowed', true),
                'address' => $session->get('buildsite/salon/address', ''),
                'zipcode' => $session->get('buildsite/salon/zipcode', ''),
                'city' => $session->get('buildsite/salon/city', ''),
                'country' => $session->get('buildsite/salon/country', ''),
                'phone' => $session->get('buildsite/salon/phone', ''),
                'email' => $session->get('buildsite/salon/email', ''),
                'schedule' => $session->get('buildsite/salon/schedule', '["0",["9h00","12h30","13h00","19h00"],["9h00","12h30","13h00","19h00"],["9h00","12h30","13h00","19h00"],["9h00","12h30","13h00","19h00"],["9h00","18h00"],"0"]')
            );

            $siteData = SiteData::get($salon);

            $session->set('buildsite/site/dataList', $siteData['dataList']);
            $session->set('buildsite/site/pageList', $siteData['pageList']);
            $session->set('buildsite/site/imageList', $siteData['imageList']);
            $session->set('buildsite/site/blockList', $siteData['blockList']);

            if($buildsite->getStepReach() == 2)
            {
                $buildsite->setStepReach(3);

                File::copyFolder('site/default/', $session->get('buildsite/site/pathBack').'upload/');

                $onload = "CadInfo.open('Etape 3', '".
                            '<h1 style="text-align:center;">Votre site a été pré-rempli avec succès!</h1><br/><br/>'.
                            '<h2 style="text-align:center;">A vous de jouer !</h2><br/>'.
                            '<br/><div style="text-align:center;"><button type="button" class="button-small button-small-blue" onclick="CadInfo.close()"><i class="icon-pencil"></i>Modifier mon site</button></div>'
                            ."');";

                $session->getFlashBag()->add('onload', $onload);

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
            'childrenAllowed' => $session->get('buildsite/salon/childrenAllowed', true),
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
}

?>