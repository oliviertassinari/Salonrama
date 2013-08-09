<?php

namespace Salonrama\MainBundle\Controller\Account;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class ConfirmEmailController extends Controller
{
    public function confirmEmailAction()
    {
        return $this->render('SalonramaMainBundle:Account:settings_delete.html.twig');
    }
}

?>