<?php

namespace Salonrama\MainBundle;

class File
{
	public static function addFolder($path)
	{
		if(!is_dir($path))
		{
			mkdir($path, 0777);
		}
	}

	public static function copyFolder($pathFrom, $pathTo) 
	{
		File::addFolder($pathTo);

		if(is_dir($pathFrom))
		{
			if($handle = opendir($pathFrom))
			{
				while(($file = readdir($handle)) !== false) //On liste les dossiers et fichiers de $pathFrom
				{
					if($file === '.' || $file === '..'){
						continue;
					}
					else if(is_dir($pathFrom.$file)) //S'il s'agit d'un dossier, on relance la fonction récursive
					{
						File::copyFolder($pathFrom.$file.'/', $pathTo.$file.'/');
					}
					else //S'il sagit d'un fichier, on le copie simplement
					{
						copy($pathFrom.$file, $pathTo.$file);
					}
				}
				closedir($handle);
			}
		}
	}

	public static function getExtension($path)
	{
		return strtolower(substr(strrchr($path, '.'), 1));
	}

	public static function removeFile($path)
	{
		if(is_file($path))
		{
			if(unlink($path)){
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

	public static function copyFile($pathFrom, $pathTo)
	{
		if(@copy($pathFrom, $pathTo))
		{
			return true;
		}
		else{
			return false;
		}
	}

	public static function addFile($txt, $path)
	{
		$file = fopen($path, 'w');
		fwrite($file, $txt);
		fclose($file);

		return true;
	}

	

	public static function delFolder($path)
	{
		if(is_dir($path))
		{
			if($handle = opendir($path))
			{
				while(($file = readdir($handle)) !== false)
				{
					if($file === '.' || $file === '..'){
						continue;
					}
					else if(is_dir($path.$file)){
						File::delFolder($path.$file.'/');
					}
					else{
						unlink($path.$file);
					}
				}
				closedir($handle);
			}
			rmdir($path);
		}
	}

	public static function getFolderSize($path)
	{
		$size = 0;

		if(is_dir($path))
		{
			if($handle = opendir($path))
			{
				while(($file = readdir($handle)) !== false)
				{
					if($file === '.' || $file === '..'){
						continue;
					}
					else if(is_dir($path.$file)){
						$size += File::getFolderSize($path.$file.'/');
					}
					else{
						$size += filesize($path.$file);
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

	public static function emptyFolder($path)
	{
		if(is_dir($path))
		{
			if($handle = opendir($path))
			{
				while(($file = readdir($handle)) !== false)
				{
					if($file === '.' || $file === '..'){
						continue;
					}
					else if(is_file($path.$file)){
						unlink($path.$file);
					}
				}
				closedir($handle);
			}
		}
		else{
			mkdir($path, 0777);
		}
	}

	public static function getFile($path)
	{
		if(@($file = file_get_contents($path))){
			return $file;
		}
		else{
			return false;
		}
	}

	public static function readFile($path)
	{
		$read = false;

		$file = fopen($path, 'r');
		$read = fread($file, filesize($path));
		fclose($file);

		return $read;
	}

	public static function getFolder($path)
	{
		$folder = array();

		if(is_dir($path))
		{
			if($handle = opendir($path))
			{
				while(($file = readdir($handle)) !== false)
				{
					if($file === '.' || $file === '..'){
						continue;
					}
					if(is_dir($path.$file))
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