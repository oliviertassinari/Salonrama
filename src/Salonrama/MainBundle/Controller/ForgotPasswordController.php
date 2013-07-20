<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class ForgotPasswordController extends Controller
{
    public function forgotPasswordAction()
    {
        return $this->render('SalonramaMainBundle:Main:forgot_password.html.twig');
    }
}

?>