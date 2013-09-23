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

        return $this->render('SalonramaMainBundle:Account:site_edit.html.twig', array(
                                                                                'blockList' => $site->getBlockList(),
                                                                                'dataList' => $site->getDataList(),
                                                                                'imageList' => $site->getImageList(),
                                                                                'themeAct' => $site->getTheme(),
                                                                                'themeList' => json_encode($themeList),
                                                                                'pageList' => $site->getPageList(),
                                                                                'pageAct' => 'index',
                                                                                'pathFront' => '/'.$site->getPathBack(),
                                                                                'galleryList' => json_encode($galleryList),
                                                                                'site_url' => $site->getUrl()
                                                                                ));
    }
}

?>