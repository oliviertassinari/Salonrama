<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\SecurityContext;

class LoginController extends Controller
{
    public function loginAction()
    {
    	$request = $this->getRequest();

    	if($request->isMethod('POST'))
    	{
            $session = $request->getSession();

            if($request->attributes->has(SecurityContext::AUTHENTICATION_ERROR))
            {
                $error = $request->attributes->get(SecurityContext::AUTHENTICATION_ERROR);
            }
            else{
                $error = $session->get(SecurityContext::AUTHENTICATION_ERROR);
                $session->remove(SecurityContext::AUTHENTICATION_ERROR);
            }

            echo $session->get(SecurityContext::LAST_USERNAME);

            //$email = htmlspecialchars(strtolower(trim($request->request->get('email', ''))));
    		//$password = trim($request->request->get('password', ''));

            $form = $this->createFormBuilder(null)
                    ->add('email', 'email', array('required' => true))
                    ->add('password', 'password', array('required' => true))
                    ->getForm();

            $form->bind($request);

            if($form->isValid())
            {
                echo '1';
                $data = $form->getData();

                print_r($data);
            }
            else{
                echo '0';
            }
    	}

        return $this->render('SalonramaMainBundle:Main:login.html.twig');
    }
}

?>