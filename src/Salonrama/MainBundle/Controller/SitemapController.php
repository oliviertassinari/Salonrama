<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Salonrama\MainBundle\Entity\User;
use Salonrama\MainBundle\Entity\Account;

class SitemapController extends Controller
{
    public function sitemapAction()
    {
    	$url = array();
    	$siteList = $this->getDoctrine()->getManager()->getRepository('SalonramaMainBundle:Site')->findAll();

    	$hostname = 'http://'.$this->getRequest()->getHost();

    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_index'), 'priority' => 1);
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_contact'), 'priority' => 0.6);
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_presentation'), 'priority' => 0.6, 'priority' => 0.6);
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_forgot_password'), 'priority' => 0.6);
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_presse'), 'priority' => 0.6);
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_index'), 'priority' => 0.6);
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_about'), 'priority' => 0.6);
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_legal'), 'priority' => 0.6);
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_policy'), 'priority' => 0.6);
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_buildsite_step1'), 'priority' => 0.6);
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_help'), 'priority' => 0.6);

		foreach ($siteList as $site)
		{
			$url[] = array('loc' => $site->getUrl(), 'lastmod' => $site->getLastUpdate(), 'priority' => 0.7);
		}

        $response = $this->render('SalonramaMainBundle:Main:sitemap.xml.twig', array('url' => $url));
        $response->headers->set('Content-Type', 'application/xml');

        return $response;
    }
}

?>