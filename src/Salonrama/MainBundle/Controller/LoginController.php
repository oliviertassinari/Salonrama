<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Validator\Constraints as Assert;

class LoginController extends Controller
{
    public function loginAction()
    {
    	$request = $this->getRequest();

    	if($request->isMethod('POST'))
    	{
            $email = htmlspecialchars(strtolower(trim($request->request->get('email', ''))));
    		$password = trim($request->request->get('password', ''));

            $collectionConstraint = new Assert\Collection(array(
                'email' => array(
                            new Assert\NotBlank(),
                            new Assert\Email()
                            ),
                'password' => array(
                             new Assert\NotBlank(),
                             new Assert\Length(array(
                                'min' => 4,
                                'max' => 25))
                            )
            ));
 
            $errors = $this->container->get('validator')->validateValue(array('email' => $email, 'password' => $password), $collectionConstraint);
     
            echo count($errors);

            print_r($errors);

    	}

        return $this->render('SalonramaMainBundle:Main:login.html.twig');
    }
}

?>