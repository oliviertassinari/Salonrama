<?php

namespace Salonrama\MainBundle\Entity;

use Doctrine\ORM\EntityRepository;

class ThemeRepository extends EntityRepository
{
	public function getAllList()
	{
        $themeAll = $this->findAll();
		$themeList = array();

		foreach($themeAll as $key => $value)
		{
			array_push($themeList, $value->getName());
		}

		return $themeList;
	}
}
