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

        include('/actualite/wp-load.php');

        global $wp_query;

        $wp_query = new \WP_Query('showposts=5&cat=4');
        $blogAdvice = array();

        while($wp_query->have_posts())
        {
            $wp_query->the_post();
            $post = get_post();

            $blogAdvice[] = array('link' => get_permalink($post->ID), 'title' => get_the_title($post->ID));
        }

        $wp_query = new \WP_Query('showposts=5');
        $blogRecent = array();

        while($wp_query->have_posts())
        {
            $wp_query->the_post();
            $post = get_post();

            $blogRecent[] = array('link' => get_permalink($post->ID), 'title' => get_the_title($post->ID));
        }

        return $this->render('SalonramaMainBundle:Account:index.html.twig', array(
                                                                                'message' => $message,
                                                                                'snapshotUrl' => $site->getSnapshotUrl(),
                                                                                'siteUrl' => $site->getUrl(),
                                                                                'last_update_interval' => Date::formatDateDiff($site->getLastUpdate()),
                                                                                'creation_interval' => Date::formatDateDiff($site->getCreation()),
                                                                                'blog_advice' => $blogAdvice,
                                                                                'blog_recent' => $blogRecent
                                                                            ));
    }
}

?>