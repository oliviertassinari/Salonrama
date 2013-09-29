<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class HelpController extends Controller
{
    public function helpAction()
    {
        $em = $this->getDoctrine()->getManager();
        $helpNodeRepository = $em->getRepository('SalonramaMainBundle:HelpNode');

        $navTab = $helpNodeRepository->getAll();

        $navBar = array('Aide', 'Adresse Internet');

        return $this->render('SalonramaMainBundle:Main:help.html.twig', array(
                                                                            'nav_tab' => $navTab,
                                                                            'nav_tab_offset' => 0,
                                                                            'nav_bar' => $navBar,
                                                                            'article' => ''
                                                                        ));
    }

    public function articleAction($id)
    {
        $request = $this->getRequest();

        $em = $this->getDoctrine()->getManager();
        $helpArticleRepository = $em->getRepository('SalonramaMainBundle:HelpArticle');
        $helpNodeRepository = $em->getRepository('SalonramaMainBundle:HelpNode');

        $navTab = $helpNodeRepository->getAll();

        $navTabFull = $this->getNavTabFull($navTab, $id, 0);
        $navTab = $navTabFull[0];
        $navTabOffset = -$navTabFull[1]/2*189;

        //echo "<pre>";
        //print_r($navTab);
        //echo "</pre>";

        $article = $helpArticleRepository->find($id);

        if($request->isXmlHttpRequest())
        {
            return $this->render('SalonramaMainBundle:Main:help_body.html.twig', array(
                                                                                'nav_tab' => $navTab,
                                                                                'nav_tab_offset' => $navTabOffset,
                                                                                'article' => $article
                                                                            ));
        }
        else
        {
            return $this->render('SalonramaMainBundle:Main:help.html.twig', array(
                                                                                'nav_tab' => $navTab,
                                                                                'nav_tab_offset' => $navTabOffset,
                                                                                'article' => $article
                                                                            ));
        }
    }

    public function getNavTabFull($navTab, $id, $depth)
    {
        $offset = 0;

        if(is_array($navTab))
        {
            foreach($navTab as $key => $value)
            {
                $full = $this->getNavTabFull($value, $id, $depth + 1);

                $navTab[$key] = $full[0];

                $offset += $full[1];

                if($full[1] != 0 && $key == 'children')
                {
                    $navTab[$key]['123'] = 'show';
                }

                if(isset($value['id']) && $value['id'] == $id)
                {
                    $offset = $depth;
                    $navTab[$key]['className'] = 'select';
                }
            }
        }

        return array($navTab, $offset);
    }
}

?>