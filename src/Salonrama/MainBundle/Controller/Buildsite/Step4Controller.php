<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Salonrama\MainBundle\Buildsite;
use Salonrama\MainBundle\Subdomain;

class Step4Controller extends Controller
{
    public function step4Action()
    {
        $request = $this->getRequest();
        $session = $request->getSession();

		$buildsite = new Buildsite($session, 4);

		if($buildsite->getStepReach() == 3)
		{
			$buildsite->setStepReach(4);
		}

        if(!$buildsite->isAllowed())
        {
            return $this->redirect($this->generateUrl('salonrama_main_buildsite_step'.$buildsite->getStepReach()));
        }

		$storyboard = $buildsite->getStoryboard();
		$foot = $buildsite->getFoot();

		if($request->isXmlHttpRequest())
		{
			$subdomain = trim($request->request->get('subdomain-subdomain', ''));
			$state = Subdomain::isAvailableSite($subdomain);

			if($state['state'] == 0)
			{
				$session->set('buildsite/site/subdomain', $subdomain);
					
				if($buildsite->getStepReach() == 4)
				{
					$buildsite->setStepReach(5);
					$state['exec'] = 'window.location="step5"';
				}
				else
				{
					$state['text'] = 'Modification enregistré.';
				}
			}
			
			return new JsonResponse($state);
		}

		$subdomain = $session->get('buildsite/site/subdomain', '');
		$suggest = array();

		$name = str_replace(' ', '-', strtolower($session->get('buildsite/salon/name')));
		$city = str_replace(' ', '-', strtolower($session->get('buildsite/salon/city')));
		$zipcode = substr($session->get('buildsite/salon/zipcode'), 0, 2);
		$client = $this->getClient($session);

		if($name != '')
		{
			$suggest = $this->addSuggest($name, $suggest);

			if($client != ''){
				$suggest = $this->addSuggest($name.'-'.$client, $suggest);
			}
			if($city != ''){
				$suggest = $this->addSuggest($name.'-'.$city, $suggest);
			}
			if(strpos($name, 'salon') === false){
				$suggest = $this->addSuggest('salon-'.$name, $suggest);
			}
			if(strpos($name, 'coiffure') === false){
				$suggest = $this->addSuggest($name.'-coiffure', $suggest);
			}
			if($zipcode != ''){
				$suggest = $this->addSuggest($name.'-'.$zipcode, $suggest);
			}
		}


        return $this->render('SalonramaMainBundle:Buildsite:step4.html.twig', array(
        																		'storyboard' => $storyboard,
        																		'foot' => $foot,
        																		'subdomain' => $subdomain,
        																		'suggest' => $suggest
        																		));
    }

    public function addSuggest($subdomain, $suggest)
    {
    	if(Subdomain::isAvailableSite($subdomain)['state'] == 0)
    	{
    		array_push($suggest, $subdomain);
    	}

    	return $suggest;
    }

    public function getClient($session)
    {
    	$client = '';

		if($session->get('buildsite/salon/menAllowed') && $session->get('buildsite/salon/womenAllowed')){
			$client = 'mixte';
		}
		else if($session->get('buildsite/salon/menAllowed')){
			$client = 'homme';
		}
		else if($session->get('buildsite/salon/womenAllowed')){
			$client = 'femme';
		}

		return $client;
    }
}

?>