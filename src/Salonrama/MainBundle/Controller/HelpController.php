<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class HelpController extends Controller
{
    public function helpAction()
    {
        return $this->render('SalonramaMainBundle:Main:help.html.twig');
    }

    public function articleAction($id)
    {
        $helpArticleRepository = $this->getDoctrine()->getManager()->getRepository('SalonramaMainBundle:HelpArticle');
        $article = $helpArticleRepository->find($id);

        return $this->render('SalonramaMainBundle:Main:help_article.html.twig', array('article' => $article));
    }
}

?>