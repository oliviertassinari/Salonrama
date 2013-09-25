<?php

namespace Salonrama\MainBundle\Controller\Account;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class SitePublishController extends Controller
{
    public function publishAction()
    {
        $request = $this->getRequest();
        $session = $request->getSession();
        $em = $this->getDoctrine()->getManager();

        $site = $this->getUser()->getAccount()->getSite();

        $site->setTheme($session->get('buildsite/site/theme'));
        $site->setImageList($session->get('buildsite/site/imageList'));
        $site->setBlockList($session->get('buildsite/site/blockList'));
        $site->setPageList($session->get('buildsite/site/pageList'));
        $site->setDataList($session->get('buildsite/site/dataList'));

        $site->update();

        $em->flush();

        $state = array('state' => 0, 'text' => 'Ok.');

        return new JsonResponse($state);
    }
}

?>