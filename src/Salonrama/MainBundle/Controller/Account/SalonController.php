<?php

namespace Salonrama\MainBundle\Controller\Account;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class SalonController extends Controller
{
    public function salonAction()
    {
		$salon = $this->getUser()->getAccount()->getSalon();

        return $this->render('SalonramaMainBundle:Account:salon.html.twig', array('salon' => $salon));
    }
}

?>