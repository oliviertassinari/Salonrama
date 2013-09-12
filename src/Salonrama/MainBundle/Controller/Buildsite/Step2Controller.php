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
            $salon = array();

            $salon['name'] = $request->request->get('salon-name');

            if($request->request->get('salon-women-allowed'))
            {
                $salon['womenAllowed'] = true;
            }
            else
            {
                $salon['womenAllowed'] = false;
            }

            if($request->request->get('salon-men-allowed'))
            {
                $salon['menAllowed'] = true;
            }
            else
            {
                $salon['name'] = false;
            }

            $salon['address'] = $request->request->get('salon-address');
            $salon['zipcode'] = $request->request->get('salon-zipcode');
            $salon['city'] = $request->request->get('salon-city');
            $salon['country'] = $request->request->get('salon-country');
            $salon['phone'] = $request->request->get('salon-phone');
            $salon['email'] = $request->request->get('salon-email');
            $salon['schedule'] = $request->request->get('salon-schedule');

            $session->set('buildsite/salon', $salon);
        }

        $salonDefault = array(
            'name' => '',
            'womenAllowed' => true,
            'menAllowed' => true,
            'address' => '',
            'zipcode' => '',
            'city' => '',
            'country' => '',
            'phone' => '',
            'email' => '',
            'schedule' => '["0",["9h00","12h30","13h00","19h00"],["9h00","12h30","13h00","19h00"],["9h00","12h30","13h00","19h00"],["9h00","12h30","13h00","19h00"],["9h00","18h00"],"0"]'
        );

        $salon = $session->get('buildsite/salon', $salonDefault);

		return $this->render('SalonramaMainBundle:Buildsite:step2.html.twig', array(
        																		'storyboard' => $storyboard,
        																		'foot' => $foot,
                                                                                'salon' => $salon,
                                                                                'message' => $message
        																		));
    }
}

?>