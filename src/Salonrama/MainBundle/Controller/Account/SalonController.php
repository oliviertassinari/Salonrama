<?php

namespace Salonrama\MainBundle\Controller\Account;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Salonrama\MainBundle\Controller\Buildsite\SiteData;

class SalonController extends Controller
{
    public function salonAction()
    {
		$request = $this->getRequest();

		if($request->isXmlHttpRequest())
		{
			$em = $this->getDoctrine()->getManager();
            $account = $this->getUser()->getAccount();
			$salon = $account->getSalon();

            if($request->request->has('reset'))
            {
                $site = $account->getSite();

                $salon = array(
                    'name' => $salon->getName(),
                    'womenAllowed' => $salon->getWomenAllowed(),
                    'menAllowed' => $salon->getMenAllowed(),
                    'childrenAllowed' => $salon->getChildrenAllowed(),
                    'address' => $salon->getAddress(),
                    'zipcode' => $salon->getZipcode(),
                    'city' => $salon->getCity(),
                    'country' => $salon->getCountry(),
                    'phone' => $salon->getPhone(),
                    'email' => $salon->getEmail(),
                    'schedule' => $salon->getSchedule()
                );

                $siteData = SiteData::get($salon);

                $site->setDataList($siteData['dataList']);
                $site->setPageList($siteData['pageList']);
                $site->setImageList($siteData['imageList']);
                $site->setBlockList($siteData['blockList']);

                $em->flush();

                $state = array('state' => 0, 'text' => 'Réinitialisation terminé.<br>Vous pouvez maintenant <a href="'.$this->generateUrl('salonrama_main_account_site_edit').'">modifier votre site</a>.');
            }
            else
            {
                $salon->setName(trim($request->request->get('salon-name')));

                if($request->request->get('salon-women-allowed') == 'true')
                {
                    $salon->setWomenAllowed(true);
                }
                else
                {
                    $salon->setWomenAllowed(false);
                }

                if($request->request->get('salon-men-allowed') == 'true')
                {
                    $salon->setMenAllowed(true);
                }
                else
                {
                    $salon->setmenAllowed(false);
                }

                if($request->request->get('salon-children-allowed') == 'true')
                {
                    $salon->setChildrenAllowed(true);
                }
                else
                {
                    $salon->setChildrenAllowed(false);
                }

                $salon->setAddress(trim($request->request->get('salon-address')));
                $salon->setZipcode(trim($request->request->get('salon-zipcode')));
                $salon->setCity(trim($request->request->get('salon-city')));
                $salon->setCountry(trim($request->request->get('salon-country')));
                $salon->setPhone(trim($request->request->get('salon-phone')));
                $salon->setEmail(mb_strtolower(trim($request->request->get('salon-email')), 'UTF-8'));
                $salon->setSchedule($request->request->get('salon-schedule'));

    			$em->flush();

    			$state = array('state' => 0, 'text' => 'Modifications sauvegardées.');
            }

			return new JsonResponse($state);
		}
		else
		{
			$salon = $this->getUser()->getAccount()->getSalon();

			return $this->render('SalonramaMainBundle:Account:salon.html.twig', array('salon' => $salon));
		}
    }
}

?>