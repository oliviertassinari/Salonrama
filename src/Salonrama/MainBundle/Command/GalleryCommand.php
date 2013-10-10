<?php 

namespace Salonrama\MainBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Salonrama\MainBundle\File;
use Salonrama\MainBundle\Entity\Gallery;
use Salonrama\MainBundle\Rand;

class GalleryCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('gallery:update')
            ->setDescription("Mettre à jour la galerie d'image")
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
    	$em = $this->getContainer()->get('doctrine')->getManager();
    	$galleryRepository = $em->getRepository('SalonramaMainBundle:Gallery');
		$extensionImage = array('jpg', 'jpeg', 'jpe', 'gif', 'png');
		$path = 'src/Salonrama/MainBundle/Resources/public/gallery/';

		$cmd = $em->getClassMetadata('SalonramaMainBundle:Gallery');
		$connection = $em->getConnection();
		$dbPlatform = $connection->getDatabasePlatform();
		$connection->query('SET FOREIGN_KEY_CHECKS=0');
		$q = $dbPlatform->getTruncateTableSql($cmd->getTableName());
		$connection->executeUpdate($q);
		$connection->query('SET FOREIGN_KEY_CHECKS=1');

		if($handle = opendir($path))
		{
			while(($file = readdir($handle)) !== false)
			{
				if($file === '.' || $file === '..'){
					continue;
				}
				else if(is_file($path.$file) && in_array(File::getExtension($file), $extensionImage))
				{
					if(strrpos($file, 'gallery_') !== 0)
					{
						$name = 'gallery_'.Rand::getId().'.'.File::getExtension($file);
						rename($path.$file, $path.$name);
					}
					else
					{
						$name = $file;
					}
					
					$size = getimagesize($path.$name);

					$gallery = new Gallery();
					$gallery->setName($name);
					$gallery->setWidth($size[0]);
					$gallery->setHeight($size[1]);

					$em->persist($gallery);
				}
			}
		}
		closedir($handle);

		$em->flush();

        $output->writeln('Update gallery bdd done.');
    }
}

?>