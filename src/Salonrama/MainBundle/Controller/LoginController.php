<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Validator\Constraints as Assert;
use Salonrama\MainBundle\Encrypter;

class LoginController extends Controller
{
    public function loginAction()
    {
    	$request = $this->getRequest();
        $email = '';

    	if($request->isMethod('POST'))
    	{
            $email = strtolower(trim($request->request->get('email', '')));
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
 
            $errors = $this->container->get('validator')->validateValue(array(
                'email' => $email,
                'password' => $password
            ), $collectionConstraint);
     
            if(count($errors) == 0)
            {
                $accountRepository = $this->getDoctrine()->getManager()->getRepository('SalonramaMainBundle:Account');

                $account = $accountRepository->findOneByEmail($email);

                if($account)
                {
                    if($password == Encrypter::decode($account->getPassword()))
                    {
                        if($account->getIsActive())
                        {
                            echo 'ok';
                        }
                    }
                }
            }
    	}

        return $this->render('SalonramaMainBundle:Main:login.html.twig', array('email' => $email));
    }
}

?>