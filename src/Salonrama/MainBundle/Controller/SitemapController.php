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

    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_index'));
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_contact'));
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_presentation'));
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_forgot_password'));
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_presse'));
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_index'));
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_about'));
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_legal'));
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_policy'));
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_buildsite_step1'));
    	$url[] = array('loc' => $hostname.$this->generateUrl('salonrama_main_help'));

		foreach ($siteList as $site)
		{
			$url[] = array('loc' => $site->getUrl(), 'lastmod' => $site->getLastUpdate());
		}

        $response = $this->render('SalonramaMainBundle:Main:sitemap.xml.twig', array('url' => $url));
        $response->headers->set('Content-Type', 'application/xml');

        return $response;
    }
}

?>