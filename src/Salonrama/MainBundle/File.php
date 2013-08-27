<?php

namespace Salonrama\MainBundle;

class File
{
	public static function delFolder($loc)
	{
		if(is_dir($loc))
		{
			if($handle = opendir($loc))
			{
				while(($file = readdir($handle)) !== false)
				{
					if($file === '.' || $file === '..'){
						continue;
					}
					else if(is_dir($loc.$file)){
						File::delFolder($loc.$file.'/');
					}
					else{
						unlink($loc.$file);
					}
				}
				closedir($handle);
			}
			rmdir($loc);
		}
	}

	public static function getFolderSize($loc)
	{
		$size = 0;

		if(is_dir($loc))
		{
			if($handle = opendir($loc))
			{
				while(($file = readdir($handle)) !== false)
				{
					if($file === '.' || $file === '..'){
						continue;
					}
					else if(is_dir($loc.$file)){
						$size += File::getFolderSize($loc.$file.'/');
					}
					else{
						$size += filesize($loc.$file);
					}
				}
				closedir($handle);
			}
		}

		return $size;
	}

	public static function getSizeFormat($size)
	{
		if($size < 1024){
			return $size." bytes";
		}
		else if($size < 1024*1024){
			$size = round($size/1024,1);
			return $size." KB";
		}
		else if($size < 1024*1024*1024){
			$size = round($size/(1024*1024), 1);
			return $size." MB";
		}
		else{
			$size = round($size/(1024*1024*1024), 1);
			return $size." GB";
		}
	}

	public static function emptyFolder($loc)
	{
		if(is_dir($loc))
		{
			if($handle = opendir($loc))
			{
				while(($file = readdir($handle)) !== false)
				{
					if($file === '.' || $file === '..'){
						continue;
					}
					else if(is_file($loc.$file)){
						unlink($loc.$file);
					}
				}
				closedir($handle);
			}
		}
		else{
			mkdir($loc, 0777);
		}
	}

	public static function addFolder($loc)
	{
		if(!is_dir($loc))
		{
			mkdir($loc, 0777);
		}
	}

	public static function copyDos($locFrom, $locTo) 
	{
		File::addFolder($locTo);

		if(is_dir($locFrom))
		{
			if($handle = opendir($locFrom))
			{
				while(($file = readdir($handle)) !== false) //On liste les dossiers et fichiers de $locFrom
				{
					if($file === '.' || $file === '..'){
						continue;
					}
					else if(is_dir($locFrom.$file)) //S'il s'agit d'un dossier, on relance la fonction récursive
					{
						File::copyDos($locFrom.$file.'/', $locTo.$file.'/');
					}
					else //S'il sagit d'un fichier, on le copie simplement
					{
						copy($locFrom.$file, $locTo.$file);
					}
				}
				closedir($handle);
			}
		}
	}

	public static function delFile($loc)
	{
		if(is_file($loc))
		{
			if(unlink($loc)){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			return true;
		}
	}

	public static function getFile($loc)
	{
		if(@($file = file_get_contents($loc))){
			return $file;
		}
		else{
			return false;
		}
	}

	public static function readFile($loc)
	{
		$read = false;

		$file = fopen($loc, 'r');
		$read = fread($file, filesize($loc));
		fclose($file);

		return $read;
	}

	public static function addFile($txt, $loc)
	{
		$file = fopen($loc, 'w');
		fwrite($file, $txt);
		fclose($file);

		return true;
	}

	public static function copyFile($locFrom, $locTo)
	{
		if(@copy($locFrom, $locTo))
		{
			return true;
		}
		else{
			return false;
		}
	}

	public static function getExtension($loc)
	{
		return strtolower(substr(strrchr($loc, '.'), 1));
	}

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

	public static function getFolder($loc)
	{
		$folder = array();

		if(is_dir($loc))
		{
			if($handle = opendir($loc))
			{
				while(($file = readdir($handle)) !== false)
				{
					if($file === '.' || $file === '..'){
						continue;
					}
					if(is_dir($loc.$file))
					{
						array_push($folder, $file);
					}
				}
			}
			closedir($handle);
		}

		return $folder;
	}
}

?>