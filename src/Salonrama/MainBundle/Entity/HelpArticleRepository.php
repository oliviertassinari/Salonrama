<?php

namespace Salonrama\MainBundle\Entity;

use Doctrine\ORM\EntityRepository;

class HelpArticleRepository extends EntityRepository
{
	public function search($query)
	{
		if($query != '')
		{
			$queryBuilder = $this->createQueryBuilder('a');
			$result = $queryBuilder->where(
					$queryBuilder->expr()->like('a.name', ':name')
				)
				->setParameter('name','%mon%')
				->getQuery()
				->getResult();

			return $result;
		}
		else
		{
			return array();
		}
	}
}
