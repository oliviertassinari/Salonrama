<?php

namespace Salonrama\MainBundle\Controller\Account;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class SiteEditController extends Controller
{
    public function editAction()
    {
        $request = $this->getRequest();
        $session = $request->getSession();

        $site = $this->getUser()->getAccount()->getSite();

        $em = $this->getDoctrine()->getManager();
        $themeList = $em->getRepository('SalonramaMainBundle:Theme')->getAllList();
        $galleryList = $em->getRepository('SalonramaMainBundle:Gallery')->getAllList();

        $session->set('buildsite/site/blockList', $site->getBlockList());
        $session->set('buildsite/site/dataList', $site->getDataList());
        $session->set('buildsite/site/imageList', $site->getImageList());
        $session->set('buildsite/site/theme', $site->getTheme());
        $session->set('buildsite/site/pageList', $site->getPageList());
        $session->set('buildsite/site/pathBack', $site->getPathBack());
        $session->set('buildsite/site/saveToBdd', true);

        return $this->render('SalonramaMainBundle:Account:site_edit.html.twig', array(
                                                                                'blockList' => $session->get('buildsite/site/blockList'),
                                                                                'dataList' => $session->get('buildsite/site/dataList'),
                                                                                'imageList' => $session->get('buildsite/site/imageList'),
                                                                                'themeAct' => $session->get('buildsite/site/theme'),
                                                                                'themeList' => json_encode($themeList),
                                                                                'pageList' => $session->get('buildsite/site/pageList'),
                                                                                'pageAct' => 'index',
                                                                                'pathFront' => '/'.$session->get('buildsite/site/pathBack'),
                                                                                'galleryList' => json_encode($galleryList),
                                                                                'site_url' => $site->getUrl()
                                                                                ));
    }
}

?>