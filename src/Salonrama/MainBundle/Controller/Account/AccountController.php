<?php

namespace Salonrama\MainBundle\Controller\Account;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class AccountController extends Controller
{
    public function siteAction()
    {
        return $this->render('SalonramaMainBundle:Account:site.html.twig');
    }

    public function salonAction()
    {
        return $this->render('SalonramaMainBundle:Account:salon.html.twig');
    }
}

?>