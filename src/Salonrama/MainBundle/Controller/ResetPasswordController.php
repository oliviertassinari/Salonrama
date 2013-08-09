<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints as Assert;

class ResetPasswordController extends Controller
{
    public function resetPasswordAction($id, $token)
    {
    	return $this->render('SalonramaMainBundle:Main:reset_password.html.twig');
    }
}

?>