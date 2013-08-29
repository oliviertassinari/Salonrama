<?php

namespace Salonrama\MainBundle\Controller\Account;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class IndexController extends Controller
{
    public function indexAction()
    {
    	$session = $this->getRequest()->getSession();

    	$message = array();

		foreach ($session->getFlashBag()->get('message', array()) as $value) {
			$message = $value;
		}

        return $this->render('SalonramaMainBundle:Account:index.html.twig', array('message' => $message));
    }
}

?>