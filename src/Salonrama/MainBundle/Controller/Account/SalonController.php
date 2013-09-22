<?php

namespace Salonrama\MainBundle\Controller\Account;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class SalonController extends Controller
{
    public function salonAction()
    {
		$request = $this->getRequest();

		if($request->isXmlHttpRequest())
		{
			$em = $this->getDoctrine()->getManager();
			$salon = $this->getUser()->getAccount()->getSalon();

            $salon->setName(trim($request->request->get('salon-name')));

            if($request->request->get('salon-women-allowed') == 'true')
            {
                $salon->setWomenAllowed(true);
            }
            else
            {
                $salon->setWomenAllowed(false);
            }

            if($request->request->get('salon-men-allowed') == 'true')
            {
                $salon->setMenAllowed(true);
            }
            else
            {
                $salon->setmenAllowed(false);
            }

            if($request->request->get('salon-children-allowed') == 'true')
            {
                $salon->setChildrenAllowed(true);
            }
            else
            {
                $salon->setChildrenAllowed(false);
            }

            $salon->setAddress(trim($request->request->get('salon-address')));
            $salon->setZipcode(trim($request->request->get('salon-zipcode')));
            $salon->setCity(trim($request->request->get('salon-city')));
            $salon->setCountry(trim($request->request->get('salon-country')));
            $salon->setPhone(trim($request->request->get('salon-phone')));
            $salon->setEmail(mb_strtolower(trim($request->request->get('salon-email')), 'UTF-8'));
            $salon->setSchedule($request->request->get('salon-schedule'));

			$em->flush();

			$state = array('state' => 0, 'text' => 'Modifications sauvegardées.');

			return new JsonResponse($state);
		}
		else
		{
			$salon = $this->getUser()->getAccount()->getSalon();

			return $this->render('SalonramaMainBundle:Account:salon.html.twig', array('salon' => $salon));
		}
    }
}

?>