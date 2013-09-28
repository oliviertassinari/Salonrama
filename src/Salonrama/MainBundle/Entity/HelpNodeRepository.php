<?php

namespace Salonrama\MainBundle\Entity;

use Doctrine\ORM\EntityRepository;

class HelpNodeRepository extends EntityRepository
{
	public function getAll()
	{
		$em = $this->getEntityManager();
		$helpArticleRepository = $em->getRepository('SalonramaMainBundle:HelpArticle');

		return array_merge($this->getChildren($helpArticleRepository->findByParent(null)), $this->getChildren(null));
	}

	public function getChildren($node)
	{
		if($node == null)
		{
			$node = $this->findByParent(null);
		}

		if(is_object($node) && get_class($node) == 'Salonrama\MainBundle\Entity\HelpArticle')
		{
			$result = array(
						'name' => $node->getName(),
						'id' => $node->getId(),
						'children' => null
					);
		}
		else if(is_object($node) && get_class($node) == 'Salonrama\MainBundle\Entity\HelpNode')
		{
			$result = array(
						'name' => $node->getName(),
						'children' => array_merge($this->getChildren($node->getChildrenArticle()), $this->getChildren($node->getChildrenNode()))
					);
		}
		else
		{
			$result = array();

			foreach($node as $key => $value)
			{
				array_push($result, $this->getChildren($value));
			}
		}

		return $result;
	}
}
