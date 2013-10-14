<?php

namespace Salonrama\MainBundle\Entity;

use Doctrine\ORM\EntityRepository;
use Salonrama\MainBundle\SequenceMatcher;

class HelpArticleRepository extends EntityRepository
{
	public function getFamous()
	{
		return $this->createQueryBuilder('a')
			->add('orderBy', 'a.view DESC')
			->setMaxResults(6)
			->getQuery()
			->getResult();
	}

	public function search($query)
	{
		if($query != '')
		{
			$queryList = explode(' ', $query);

			$qb = $this->createQueryBuilder('a');

			$orX = $qb->expr()->orX();
			$parameters = array();

			foreach($queryList as $key => $value)
			{
				$orX->add($qb->expr()->like('a.name', ':name'.$key));
				$orX->add($qb->expr()->like('a.template', ':template'.$key));
				$parameters['name'.$key] = '%'.$value.'%';
				$parameters['template'.$key] = '%'.$value.'%';
			}

			$qb = $qb->add('where', $orX)
				->setParameters($parameters)
				->setMaxResults(40)
				->getQuery();

			$queryResult = $qb->getResult();

			$result = array();

			foreach($queryResult as $key => $value)
			{
				$name = $value->getName();
				$template = strip_tags($value->getTemplate());
				$score = 0;

				preg_match_all('/'.implode('|',$queryList).'/i', $name, $matches, PREG_OFFSET_CAPTURE);
				
				if($matches[0])
				{
					$score += 2*count($matches[0]);
					$matches[0] = array_reverse($matches[0]);

					foreach($matches[0] as $value2)
					{
						if(strlen($value2[0]) > 2)
						{
							$name = substr($name, 0, $value2[1]) . '<b>' . substr($name, $value2[1], strlen($value2[0])) . '</b>' . substr($name, $value2[1] + strlen($value2[0]));
						}
					}
				}

				preg_match_all('/'.implode('|',$queryList).'/i', $template, $matches, PREG_OFFSET_CAPTURE);
				
				if($matches[0])
				{
					$score += count($matches[0]);
					$matches[0] = array_reverse($matches[0]);

					foreach($matches[0] as $value2)
					{
						if(strlen($value2[0]) > 2)
						{
							$template = substr($template, 0, $value2[1]) . '<b>' . substr($template, $value2[1], strlen($value2[0])) . '</b>' . substr($template, $value2[1] + strlen($value2[0]));
						}
					}
				}

				$result[] = array(
								'id' => $value->getId(),
								'name' => $name,
								'template' => $template,
								'score' => $score
 							);


			}

			usort($result, array($this, 'usort'));

			return $result;
		}
		else
		{
			return array();
		}
	}

	public function usort($a, $b)
	{
		if($a['score'] == $b['score'])
		{
			return 0;
		}
		else if($a['score'] > $b['score'])
		{
			return -1;
		}
		else
		{
			return +1;
		}
	}
}
