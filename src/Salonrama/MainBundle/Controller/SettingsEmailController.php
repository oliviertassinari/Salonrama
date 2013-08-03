<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints as Assert;

class SettingsEmailController extends Controller
{
    public function emailAction()
    {
        $request = $this->get('request');

        if($request->isXmlHttpRequest())
        {
            $email = trim($request->request->get('email-email', ''));

            $errors = $this->container->get('validator')->validateValue($email, array(
                                                                            new Assert\NotBlank(),
                                                                            new Assert\Email()
                                                                        ));
            if(count($errors) == 0)
            {
                $state = array('state' => 0, 'text' => 'ok');
            }
            else
            {
                $state = array('state' => 1, 'text' => "L'email est invalide");
            }

            return new JsonResponse($state);
        }
        else
        {
            return $this->render('SalonramaMainBundle:Account:settings_email.html.twig');
        }
    }
}

?>