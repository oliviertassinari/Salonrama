<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PolicyController extends Controller
{
    public function policyAction()
    {
        return $this->render('SalonramaMainBundle:Main:policy.html.twig');
    }
}

?>