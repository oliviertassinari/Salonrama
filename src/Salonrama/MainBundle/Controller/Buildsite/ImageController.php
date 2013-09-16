<?php

namespace Salonrama\MainBundle\Controller\Buildsite;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Salonrama\MainBundle\File;

class ImageController extends Controller
{
	private $extensionImage = array('jpg', 'jpeg', 'jpe', 'gif', 'png');
	private $sizeMax = array('10Mo', 10485760); // 10 MegaOcte

    public function imageAction()
    {
		$request = $this->getRequest();
		$session = $request->getSession();
		$state = array('state' => 1, 'text' => 'Requête invalide.');

		$this->pathUpload = $session->get('buildsite/site/pathStepBack').'upload/';

		if(is_dir($this->pathUpload))
		{
			if(isset($_FILES['addUploadFile']))
			{
				$state = $this->addUploadFile($_FILES['addUploadFile']);
			}
			else if(isset($_POST['addUrl']))
			{
				$state = $this->addUrl($_POST['addUrl']);
			}
			else if(isset($_POST['addBdd']))
			{
				$state = $this->addBdd($_POST['addBdd']);
			}
			else if(isset($_POST['remove']))
			{
				$state = $this->remove($_POST['remove']);
			}
		}
		else
		{
			$state = array('state' => 1, 'text' => 'folder not found.');
		}

		return new JsonResponse($state);
    }

	public function addUploadfile($file)
	{
		if($file['error'] == 0)
		{
			if($file['size'] < $this->sizeMax[1]) // Octet
			{
				if($file['size'] > 0)
				{
					$extension = File::getExtension($file['name']);

					if(in_array($extension, $this->extensionImage))
					{
						$name = rand(0, 100000);
						$path = $this->pathUpload.$name.'.'.$extension;

						if(@move_uploaded_file($file['tmp_name'], $path))
						{
							$size = $this->resizeImage($path);

							return array('state' => 0, 'text' => array($name.'.jpg', $size[0], $size[1]));
						}
						else{ return array('state' => 1, 'text' => 'Traitement impossible.'); }
					}
					else{ return array('state' => 1, 'text' => 'Extension invalide (.'.$extension.').'); }
				}
				else{ return array('state' => 1, 'text' => 'Image introuvable.'); }
			}
			else{ return array('state' => 1, 'text' => 'Taille limité à '.$this->sizeMax[0].')'); }
		}
		else{ return array('state' => 1, 'text' => 'Erreur (PHP_'.$file['error'].')'); }
	}

	public function addUrl($url)
	{
		if(preg_match('#^(http:\/\/)?([\w\-\.]+)\:?([0-9]*)\/(.*)$#', $url, $url_ary) && !empty($url_ary[4]))
		{
			$extension = File::getExtension($url_ary[4]);

			if(!empty($extension))
			{
				if(in_array($extension, $this->extensionImage))
				{
					$port = (!empty($url_ary[3])) ? $url_ary[3] : 80;

					if(@($fsock = fsockopen($url_ary[2], $port, $errno, $errstr)))
					{
						fputs($fsock, "GET /".$url_ary[4]." HTTP/1.1\r\n");
						fputs($fsock, "Host: ".$url_ary[2]."\r\n");
						fputs($fsock, "Accept-Language: fr\r\n");
						fputs($fsock, "Accept-Encoding: none\r\n");
						fputs($fsock, "User-Agent: PHP\r\n");
						fputs($fsock, "Connection: close\r\n\r\n");

						$data = '';
						while(!feof($fsock))
						{
							$data .= fread($fsock, $this->sizeMax[1]);
						}
						fclose($fsock);

						if(preg_match('(200 OK)', $data))
						{
							if(preg_match('#Content-Length\: ([0-9]+)[^ /][\s]+#i', $data, $size) && preg_match('#Content-Type\: image/[x\-]*([a-z]+)[\s]+#i', $data, $extension))
							{
								$size = $size[1]; //Octet
								$extension = $extension[1]; 

								if($size > 0)
								{
									if($size < $this->sizeMax[1])
									{
										if(in_array($extension, $this->extensionImage))
										{
											$data = substr($data, strlen($data) - $size, $size);

											$name = rand(0, 100000);
											$path = $this->pathUpload.$name.'.'.$extension;

											if(@File::addFile($data, $path))
											{
												$size = $this->resizeImage($path);

												return array('state' => 0, 'text' => array($name.'.jpg', $size[0], $size[1]));
											}
											else{ return array('state' => 1, 'text' => 'Erreur de deplacement.'); }
										}
										else{ return array('state' => 1, 'text' => 'Extension invalide (.'.$extension.').'); }
									}
									else{ return array('state' => 1, 'text' => 'Taille limité a '.$this->sizeMax[0]); }
								}
								else{ return array('state' => 1, 'text' => 'Aucune donnée.'); }
							}
							else{ return array('state' => 1, 'text' => 'Aucune donnée.'); }
						}
						else{ return array('state' => 1, 'text' => 'Image introuvable.'); }
					}
					else{ return array('state' => 1, 'text' => 'Connextion impossible.'); }
				}
				else{ return array('state' => 1, 'text' => 'Extension invalide (.'.$extension.').'); }
			}
			else{ return array('state' => 1, 'text' => 'Aucune extension.'); }
		}
		else{ return array('state' => 1, 'text' => 'Adresse invalide.'); }
	}

	public function addBdd($name)
	{
		$name = str_replace('/', '', $name);
		$path = '../src/Salonrama/MainBundle/Resources/public/gallery/'.$name;
		$nameNew = rand(0, 100000).'.jpg';

		if(is_file($path))
		{
			if(File::copyFile($path, $this->pathUpload.$nameNew))
			{
				return array('state' => 1, 'text' => $nameNew);
			}
			else{
				return array('state' => 1, 'text' => 'Echec de la copie de l\image.');
			}
		}
		else{
			return array('state' => 1, 'text' => 'Impossible de trouver l\'image.');
		}
	}

	public function resizeImage($path)
	{
		$extension = File::getExtension($path);
		$pathNew = substr($path, 0, strrpos($path, '.')).'.jpg';

		$size = getimagesize($path);
		$src_w = $size[0]; 
		$src_h = $size[1];
		$dst_w = 640;
		$dst_h = 480;

		if($src_w < $dst_w && $src_h < $dst_h) // Taille correcte
		{
			if($extension != 'jpg')
			{
				$image = $this->getImage($extension, $path);

				imagejpeg($image, $pathNew);
				File::removeFile($path);
			}

			return array($src_w, $src_h);
		}
		else // Redimentionnage
		{
			$test_h = round(($dst_w / $src_w) * $src_h);
			$test_w = round(($dst_h / $src_h) * $src_w);

			if($test_h > $dst_h){ 
				$dst_w = $test_w; 
			}
			else{
				$dst_h = $test_h; 
			}

			$image = $this->getImage($extension, $path);
			$imageNew = imagecreatetruecolor($dst_w, $dst_h);

			imagecopyresampled($imageNew, $image, 0, 0, 0, 0, $dst_w, $dst_h, $src_w, $src_h);
			imagejpeg($imageNew, $pathNew);

			if($extension != 'jpg'){
				File::removeFile($path);
			}

			return array($dst_w, $dst_h);
		}
	}

	public function getImage($extension, $path)
	{
		if(in_array($extension, array('jpg', 'jpeg', 'jpe'))){
			return imagecreatefromjpeg($path);
		}
		else if($extension == 'png'){
			return imagecreatefrompng($path);
		}
		else if($extension == 'gif'){
			return imagecreatefromgif($path);
		}
	}

	public function remove($name)
	{
		$name = str_replace('/', '', $name);

		if(File::removeFile($this->pathUpload.$name))
		{
			return array('state' => 0, 'text' => 'Image supprimée.');
		}
		else
		{
			return array('state' => 1, 'text' => 'Echec de la supression.');
		}
	}
}

?>