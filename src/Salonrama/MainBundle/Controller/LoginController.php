<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class LoginController extends Controller
{
    public function loginAction()
    {
    	$request = $this->get('request');

    	if($request->isMethod('POST'))
    	{
    		$email = htmlspecialchars(strtolower(trim($request->request->get('email', ''))));
    		$password = trim($request->request->get('password', ''));
    	}

        return $this->render('SalonramaMainBundle:Main:login.html.twig');
    }
}

?>