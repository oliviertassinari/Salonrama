<?php

namespace Salonrama\MainBundle;

class Rand
{
	private static $idList = array();

	public static function getId()
	{
		$keep = true;
		do
		{
			$id = rand(0, 10000);

			if(!isset(self::$idList[$id]))
			{
				self::$idList[$id] = true;
				$keep = false;
			}
		}
		while($keep);

		return $id;
	}
}

?>