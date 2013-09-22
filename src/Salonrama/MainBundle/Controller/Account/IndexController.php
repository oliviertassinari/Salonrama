<?php

namespace Salonrama\MainBundle\Controller\Account;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Salonrama\MainBundle\Date;

class IndexController extends Controller
{
    public function indexAction()
    {
    	$session = $this->getRequest()->getSession();

    	$message = array();

		foreach ($session->getFlashBag()->get('message', array()) as $value) {
			$message = $value;
		}

		$site = $this->getUser()->getAccount()->getSite();

        return $this->render('SalonramaMainBundle:Account:index.html.twig', array(
        																		'message' => $message,
        																		'snapshotUrl' => $site->getSnapshotUrl(),
                                                                                'siteUrl' => $site->getUrl(),
                                                                                'last_update_interval' => Date::formatDateDiff($site->getLastUpdate()),
                                                                                'creation_interval' => Date::formatDateDiff($site->getCreation())
        																	));
    }
}

?>