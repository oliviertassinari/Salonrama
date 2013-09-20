<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints as Assert;
use Salonrama\MainBundle\Buildsite;
use Salonrama\MainBundle\Entity\User;
use Salonrama\MainBundle\Entity\Salon;
use Salonrama\MainBundle\Entity\Site;
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
			$firstName = trim($request->request->get('publish-firstname'));
			$lastName = trim($request->request->get('publish-lastname'));
			$email = strtolower(trim($request->request->get('publish-email')));
			$password = trim($request->request->get('publish-password'));

			$collectionConstraint = new Assert\Collection(array(
			    'email' => array(
			                new Assert\NotBlank(),
			                new Assert\Email()
			                ),
			    'firstName' => array(new Assert\NotBlank()),
			    'lastName' => array(new Assert\NotBlank()),
			    'password' => array(
								new Assert\NotBlank(),
                             	new Assert\Length(array('min' => 4, 'max' => 25))
                             )
			));

			$errors = $this->container->get('validator')->validateValue(array(
			    'firstName' => $firstName,
			    'lastName' => $lastName,
			    'email' => $email,
			    'password' => $password
			), $collectionConstraint);

			$em = $this->getDoctrine()->getManager();

			$userRepository = $em->getRepository('SalonramaMainBundle:User');
			$findUser = $userRepository->findOneByEmail($email);
				
			require_once('../src/Salonrama/MainBundle/Recaptchalib.php');
			$privatekey = '6LeyqucSAAAAAAgcPlMvhUwamHlQG087Ih-fU11j ';
			$resp = recaptcha_check_answer($privatekey, $_SERVER["REMOTE_ADDR"],
				$request->request->get('recaptcha_challenge_field'),
				$request->request->get('recaptcha_response_field')
			);

			if($request->isXmlHttpRequest())
			{
				if(count($errors) == 0)
				{
					if(!$findUser)
					{
						if($resp->is_valid)
						{
							$state = array('state' => 0, 'text' => "Ok.");
						}
						else
						{
							$state = array('state' => 1, 'text' => "Les caractères que vous avez saisis ne correspondent pas à l'image. Veuillez réessayer.",
											'exec' => "Recaptcha.reload();self.setInputState($('#recaptcha_response_field'), response)");
						}
					}
					else
					{
						$state = array('state' => 1, 'text' => 'Adresse email déjà utilisée.',
											'exec' => "self.setInputState($('#publish-email'), response)");
					}
				}
				else
				{
					$state = array('state' => 1, 'text' => 'Champs Invalides.', 'exec' => 'self.setGlobalState(response.state, response.text)');
				}

				return new JsonResponse($state);
			}
			else 
			{
				if(count($errors) == 0 && $resp->is_valid && !$findUser)
				{
					$salon = new Salon();
					$salon->setName($session->get('buildsite/salon/name'))
					->setEmail($session->get('buildsite/salon/email'))
					->setPhone($session->get('buildsite/salon/phone'))
					->setAddress($session->get('buildsite/salon/address'))
					->setZipcode($session->get('buildsite/salon/zipcode'))
					->setCity($session->get('buildsite/salon/city'))
					->setCountry($session->get('buildsite/salon/country'))
					->setSchedule($session->get('buildsite/salon/schedule'))
					->setMenAllowed($session->get('buildsite/salon/menAllowed'))
					->setWomenAllowed($session->get('buildsite/salon/womenAllowed'))
					->setChildrenAllowed($session->get('buildsite/salon/childrenAllowed'));

					$site = new Site();
					$site->setTheme($session->get('buildsite/site/theme'))
					->setPathBack($session->get('buildsite/site/pathStepBack'))
					->setSubdomain($session->get('buildsite/site/subdomain'))
					->setImageList($session->get('buildsite/site/imageList'))
					->setBlockList($session->get('buildsite/site/blockList'))
					->setPageList($session->get('buildsite/site/pageList'))
					->setDataList($session->get('buildsite/site/dataList'))
					->setCreation(new \DateTime())
					->setLastUpdate(new \DateTime())
					->setIsOnline(false);

					$account = new Account();
					$account->setFirstName($firstName)
					->setLastName($lastName)
					->setNewsletterSend(true)
					->setSite($site)
					->setSalon($salon);

					$user = new User();
					$user->setEmail($email)
					->setPassword($password)
					->setAccount($account)
					->setConfirmEmail($email)
                    ->setConfirmEmailToken('regenerate');

					$em->persist($site);
					$em->persist($salon);
					$em->persist($account);
					$em->persist($user);

					$em->flush();

					$sessionAll = $session->all();
					foreach($sessionAll as $key => $value)
					{
						if(strrpos($key, 'buildsite/') === 0)
						{
						    $session->remove($key);
						}
					}

					$mailer = $this->get('salonrama_main_mailer');
					$mailer->sendConfirmEmail($email, $account->getName(), 'http://www.salonrama.fr/confirm_email/'.
																			$user->getId().'/'.$user->getConfirmEmailToken());

					return $this->render('SalonramaMainBundle:Buildsite:step_end.html.twig', array('email' => $email));
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