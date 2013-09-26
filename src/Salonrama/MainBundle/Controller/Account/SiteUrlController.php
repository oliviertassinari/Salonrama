<?php

namespace Salonrama\MainBundle\Controller\Account;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class SiteUrlController extends Controller
{
    public function urlAction()
    {
        $request = $this->getRequest();
        $em = $this->getDoctrine()->getManager();
        $site = $this->getUser()->getAccount()->getSite();

        if($request->isXmlHttpRequest())
        {
            $subdomainService = $this->get('salonrama_main_subdomain');
            $subdomain = trim($request->request->get('url-subdomain', ''));
            $state = $subdomainService->isAvailableSite($subdomain);

            if($state['state'] == 0)
            {
                $subdomainService->addSite($subdomain, $site->getId());
                $subdomainService->removeSite($site->getSubdomain());

                $site->setSubdomain($subdomain);
                $em->flush();

                $state = array('state' => 0, 'text' => 'Adresse modifiée');
            }

            return new JsonResponse($state);
        }
        else
        {
            return $this->render('SalonramaMainBundle:Account:site_url.html.twig', array('subdomain' => $site->getSubdomain()));
        }
    }
}

?>