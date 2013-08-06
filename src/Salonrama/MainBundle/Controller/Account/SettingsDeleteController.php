<?php

namespace Salonrama\MainBundle\Controller\Account;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints as Assert;

class SettingsDeleteController extends Controller
{
    public function deleteAction()
    {
        $request = $this->get('request');

        if($request->isXmlHttpRequest())
        {
            $password = trim($request->request->get('delete-password', ''));

            $errors = $this->container->get('validator')->validateValue($password, array(
                                                                                        new Assert\NotBlank(),
                                                                                        new Assert\Length(array('min' => 4, 'max' => 25))
                                                                                ));

            if(count($errors) == 0)
            {
                $user = $this->getUser();

                if($user->getPassword() == $password)
                {
                    $state = array('state' => 0, 'text' => 'Champ Invalide.');
                }
                else
                {
                    $state = array('state' => 1, 'text' => 'Le mot de passe est incorrect.');
                }
            }
            else
            {
                $state = array('state' => 1, 'text' => 'Champ Invalide.');
            }

            return new JsonResponse($state);
        }
        else
        {
            return $this->render('SalonramaMainBundle:Account:settings_delete.html.twig');
        }
    }
}

?>