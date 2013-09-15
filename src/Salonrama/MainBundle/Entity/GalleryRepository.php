<?php

namespace Salonrama\MainBundle\Entity;

use Doctrine\ORM\EntityRepository;

class GalleryRepository extends EntityRepository
{
	public function getAllList()
	{
        $galleryAll = $this->findAll();
		$galleryList = array();

		foreach ($galleryAll as $key => $value) {
			$galleryList[$value->getName()] = array($value->getWidth(), $value->getHeight());
		}

		return $galleryList;
	}
}
