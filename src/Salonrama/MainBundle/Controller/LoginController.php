<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\SecurityContext;

class LoginController extends Controller
{
    public function loginAction()
    {
        $request = $this->getRequest();
        $session = $request->getSession();

        // get the login error if there is one
        if($request->attributes->has(SecurityContext::AUTHENTICATION_ERROR))
        {
            $error = $request->attributes->get(SecurityContext::AUTHENTICATION_ERROR);
        }
        else
        {
            $error = $session->get(SecurityContext::AUTHENTICATION_ERROR);
            $session->remove(SecurityContext::AUTHENTICATION_ERROR);
        }

        if($error && $error->getMessage() == 'User account is disabled.')
        {
            $email = $session->get(SecurityContext::LAST_USERNAME);

            return $this->render('SalonramaMainBundle:Buildsite:step_end.html.twig', array('email' => $email));
        }

        return $this->render('SalonramaMainBundle:Main:login.html.twig', array('email' => $session->get(SecurityContext::LAST_USERNAME), 'error' => $error));
    }
}

?>