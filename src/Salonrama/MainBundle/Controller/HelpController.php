<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class HelpController extends Controller
{
    public function helpAction()
    {
        $em = $this->getDoctrine()->getManager();
        $helpArticleRepository = $em->getRepository('SalonramaMainBundle:HelpArticle');
        $helpNodeRepository = $em->getRepository('SalonramaMainBundle:HelpNode');

        $subArray = $helpArticleRepository->findByParent(null);
        $myArray = $helpNodeRepository->findByParent(null);
        $navTab = array_merge($subArray, $myArray);

        return $this->render('SalonramaMainBundle:Main:help.html.twig', array('nav_tab' => $navTab));
    }

    public function articleAction($id)
    {
        $helpArticleRepository = $this->getDoctrine()->getManager()->getRepository('SalonramaMainBundle:HelpArticle');
        $article = $helpArticleRepository->find($id);

        return $this->render('SalonramaMainBundle:Main:help_article.html.twig', array('article' => $article));
    }
}

?>