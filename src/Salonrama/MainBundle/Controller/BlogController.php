<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class BlogController extends Controller
{
    public function blogAction($url = '')
    {
		define('WP_USE_THEMES', true);

		ob_start();
		require('blog/wp-blog-header.php');
		$blog = ob_get_contents();
		ob_end_clean();

		$hostname = 'http://'.$this->getRequest()->getHost();

		$blog = preg_replace('#'.$hostname.'/blog/\?#', $hostname.$this->generateUrl('salonrama_main_blog_index').'?', $blog);

		return $this->render('SalonramaMainBundle:Main:blog.html.twig', array(
																			'title' => wp_title( '-', false, 'right'),
																			'body' => $blog
			));
	}
}

?>