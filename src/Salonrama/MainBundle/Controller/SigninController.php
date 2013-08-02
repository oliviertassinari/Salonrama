<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Salonrama\MainBundle\Entity\User;
use Salonrama\MainBundle\Entity\Account;

class SigninController extends Controller
{
    public function signinAction()
    {
		$account = new Account();
		$account->setFirstName('Olivier');
		$account->setLastName('Tassinari');
		$account->setBorn(new \DateTime());

		$user = new User();
		$user->setEmail('contact@salonrama.fr');
		$user->setPassword('poukanel');
		$user->setAccount($account);
		$user->setIsActive(true);
		$user->setLastLogin(new \DateTime());
		$user->setSignin(new \DateTime());

		$em = $this->getDoctrine()->getManager();

		$em->persist($account);
		$em->persist($user);

		$em->flush();

        return $this->render('SalonramaMainBundle:Main:legal.html.twig');
    }
}

?>