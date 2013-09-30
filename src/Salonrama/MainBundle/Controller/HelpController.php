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
        $nav = $this->getNav($navTab);

        return $this->render('SalonramaMainBundle:Main:help.html.twig', array(
                                                                            'nav_tab' => $nav[0],
                                                                            'nav_tab_offset' => 0,
                                                                            'nav_bar' => $nav[1],
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
        $nav = $this->getNav($navTab, $id);

        $article = $helpArticleRepository->find($id);

        if($request->isXmlHttpRequest())
        {
            return $this->render('SalonramaMainBundle:Main:help_body.html.twig', array(
                                                                                'nav_tab' => $nav[0],
                                                                                'nav_tab_offset' => -$nav[3]*189,
                                                                                'nav_bar' => $nav[1],
                                                                                'article' => $article
                                                                            ));
        }
        else
        {
            return $this->render('SalonramaMainBundle:Main:help.html.twig', array(
                                                                                'nav_tab' => $nav[0],
                                                                                'nav_tab_offset' => -$nav[3]*189,
                                                                                'nav_bar' => $nav[1],
                                                                                'article' => $article
                                                                            ));
        }
    }

    public function getNav($navTab, $id = -1, $navBar = array(), $depth = 0)
    {
        $foundNew = false;
        $offset = 0;

        foreach($navTab as $key => $value)
        {
            $nav = $this->getNav($value['children'], $id, $navBar, $depth + 1);

            $navTab[$key]['children'] = $nav[0];
            $navBar = $nav[1];
            $found = $nav[2];
            $offset += $nav[3];
            
            if(!$foundNew)
            {
                $foundNew = $found;
            }

            if($found)
            {
                array_unshift($navBar, $value['name']);
                $navTab[$key]['class'] = 'show';
            }

            if(isset($value['id']) && $value['id'] == $id)
            {
                $offset = $depth;
                $foundNew = true;
                $navTab[$key]['class'] = 'select';
            }
        }

        if($depth == 0)
        {
            array_unshift($navBar, 'Aide');
        }

        return array($navTab, $navBar, $foundNew, $offset);
    }
}

?>