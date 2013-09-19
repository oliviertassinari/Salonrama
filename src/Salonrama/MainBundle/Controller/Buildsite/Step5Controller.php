<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Salonrama\MainBundle\Buildsite;
use Salonrama\MainBundle\Entity\User;
use Salonrama\MainBundle\Entity\Account;

class Step5Controller extends Controller
{
    public function step5Action()
    {
        $request = $this->getRequest();
        $session = $request->getSession();

		$buildsite = new Buildsite($session, 5);

        if(!$buildsite->isAllowed())
        {
            return $this->redirect($this->generateUrl('salonrama_main_buildsite_step'.$buildsite->getStepReach()));
        }

		$storyboard = $buildsite->getStoryboard();

        if($request->isMethod('POST'))
        {
            require_once('../src/Salonrama/MainBundle/Recaptchalib.php');
            $privatekey = '6LeyqucSAAAAAAgcPlMvhUwamHlQG087Ih-fU11j ';
            $resp = recaptcha_check_answer($privatekey, $_SERVER["REMOTE_ADDR"],
                $request->request->get('recaptcha_challenge_field'),
                $request->request->get('recaptcha_response_field')
            );

            if($request->isXmlHttpRequest())
            {
                if($resp->is_valid)
                {
                    $state = array('state' => 0, 'text' => "Ok");
                }
                else
                {
                    $state = array('state' => 1, 'text' => "Les caractères que vous avez saisis ne correspondent pas à l'image de vérification des mots. Veuillez réessayer.");
                }

                return new JsonResponse($state);
            }
            else
            {
                if($resp->is_valid)
                {
                    $firstName = trim($request->request->get('publish-firstname'));
                    $lastName = trim($request->request->get('publish-lastname'));
                    $email = trim($request->request->get('publish-email'));
                    $password = trim($request->request->get('publish-password'));

                    $em = $this->getDoctrine()->getManager();
                 
                    $account = new Account();
                    $account->setFirstName($firstName);
                    $account->setLastName($lastName);

                    $user = new User();
                    $user->setEmail($email);
                    $user->setPassword($password);
                    $user->setAccount($account);

                    //$em->persist($account);
                    //$em->persist($user);

                    //$em->flush();
                }
            }
        }

        return $this->render('SalonramaMainBundle:Buildsite:step5.html.twig', array(
                                                                                'storyboard' => $storyboard,
                                                                                'pathStepFront' => $session->get('buildsite/site/pathStepFront')
                                                                            ));
    }
}

?>