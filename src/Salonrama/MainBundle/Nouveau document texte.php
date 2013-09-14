<?php

	public static function getImage($loc)
	{
		$extensionImage = array('jpg', 'jpeg', 'jpe', 'gif', 'png');
		$image = array();

		if(is_dir($loc))
		{
			if($handle = opendir($loc))
			{
				while(($file = readdir($handle)) !== false)
				{
					if($file === '.' || $file === '..'){
						continue;
					}
					else if(is_file($loc.$file) && in_array(getExtension($file), $extensionImage))
					{
						$size = getimagesize($loc.$file);
						$image[$file] = array($size[0], $size[1]);
					}
				}
			}
			closedir($handle);
		}

		return $image;
	}

?>