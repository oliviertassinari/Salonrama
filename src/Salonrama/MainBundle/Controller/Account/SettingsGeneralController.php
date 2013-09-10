<?php

namespace Salonrama\MainBundle\Controller\Account;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints as Assert;

class SettingsGeneralController extends Controller
{
    public function generalAction()
    {
        $request = $this->getRequest();

        if($request->isXmlHttpRequest())
        {
            $firstName = trim($request->request->get('general-firstname', ''));
            $lastName = trim($request->request->get('general-lastname', ''));

            $collectionConstraint = new Assert\Collection(array(
                'firstName' => array(new Assert\NotBlank()),
                'lastName' => array(new Assert\NotBlank())
            ));

            $errors = $this->container->get('validator')->validateValue(array(
                'firstName' => $firstName,
                'lastName' => $lastName,
            ), $collectionConstraint);

            if(count($errors) == 0)
            {
                $user = $this->getUser();
                $em = $this->getDoctrine()->getManager();

                $user->getAccount()->setFirstName($firstName)->setLastName($lastName);

                $em->flush();

                $state = array('state' => 0, 'text' => 'Modifications sauvegardées.');
            }
            else
            {
                $state = array('state' => 1, 'text' => 'Champs Invalides.');
            }

            return new JsonResponse($state);
        }
        else
        {
            return $this->render('SalonramaMainBundle:Account:settings_general.html.twig');
        }
    }
}

?>