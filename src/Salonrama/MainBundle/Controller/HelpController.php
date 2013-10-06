<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class HelpController extends Controller
{
    public function helpAction()
    {
        $request = $this->getRequest();
        $em = $this->getDoctrine()->getManager();
        $helpNodeRepository = $em->getRepository('SalonramaMainBundle:HelpNode');
        $helpArticleRepository = $em->getRepository('SalonramaMainBundle:HelpArticle');

        $navTab = $helpNodeRepository->getAll();
        $nav = $this->getNav($navTab);

        $helpFamous = $helpArticleRepository->getFamous();

        if($request->isXmlHttpRequest())
        {
            return new Response($this->get('twig')->loadTemplate("SalonramaMainBundle:Main:help_index.html.twig")->renderBlock('help_nav', array(
                                                                                'nav_tab' => $nav[0],
                                                                                'nav_tab_offset' => 0,
                                                                                'nav_bar' => $nav[1],
                                                                                'help_famous' => $helpFamous
                                                                            )));
        }
        else
        {
            return $this->render('SalonramaMainBundle:Main:help_index.html.twig', array(
                                                                                'nav_tab' => $nav[0],
                                                                                'nav_tab_offset' => 0,
                                                                                'nav_bar' => $nav[1],
                                                                                'focus_query' => true,
                                                                                'help_famous' => $helpFamous
                                                                            ));
        }
    }

    public function searchAction()
    {
        $request = $this->getRequest();

        $em = $this->getDoctrine()->getManager();
        $helpNodeRepository = $em->getRepository('SalonramaMainBundle:HelpNode');
        $helpArticleRepository = $em->getRepository('SalonramaMainBundle:HelpArticle');

        $navTab = $helpNodeRepository->getAll();
        $nav = $this->getNav($navTab);

        $query = trim($request->query->get('query', ''));

        $searchResult = $helpArticleRepository->search($query);

        if($request->isXmlHttpRequest())
        {
            return new Response($this->get('twig')->loadTemplate("SalonramaMainBundle:Main:help_search.html.twig")->renderBlock('help_nav', array(
                                                                                'nav_tab' => $nav[0],
                                                                                'nav_tab_offset' => 0,
                                                                                'nav_bar' => $nav[1],
                                                                                'query' => $query,
                                                                                'search_result' => $searchResult
                                                                            )));
        }
        else
        {
            return $this->render('SalonramaMainBundle:Main:help_search.html.twig', array(
                                                                                'nav_tab' => $nav[0],
                                                                                'nav_tab_offset' => 0,
                                                                                'nav_bar' => $nav[1],
                                                                                'query' => $query,
                                                                                'search_result' => $searchResult
                                                                            ));
        }


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
            if($request->request->has('feedback'))
            {
                if($request->request->get('feedback', '') == 'yes')
                {
                    $article->setFeedbackYes($article->getFeedbackYes() + 1);
                    $em->flush();
                }
                else if($request->request->get('feedback', '') == 'no')
                {
                    $article->setFeedbackNo($article->getFeedbackNo() + 1);
                    $em->flush();
                }

                return new JsonResponse(array('state' => 0, 'text' => 'Ok.'));
            }
            else
            {
                $article->setView($article->getView() + 1);
                $em->flush();

                return new Response($this->get('twig')->loadTemplate("SalonramaMainBundle:Main:help_article.html.twig")->renderBlock('help_nav', array(
                                                                                    'nav_tab' => $nav[0],
                                                                                    'nav_tab_offset' => -$nav[3]*189,
                                                                                    'nav_bar' => $nav[1],
                                                                                    'article' => $article
                                                                                )));
            }
        }
        else
        {
            $article->setView($article->getView() + 1);
            $em->flush();

            return $this->render('SalonramaMainBundle:Main:help_article.html.twig', array(
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