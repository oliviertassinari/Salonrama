<?php 

namespace Salonrama\MainBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Salonrama\MainBundle\File;
use Salonrama\MainBundle\Entity\Theme;

class ThemeCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('theme:update')
            ->setDescription("Mettre à jour la liste des themes")
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
    	$em = $this->getContainer()->get('doctrine')->getManager();
    	$themeRepository = $em->getRepository('SalonramaMainBundle:Theme');
		$path = 'src/Salonrama/MainBundle/Resources/public/theme/';

		$cmd = $em->getClassMetadata('SalonramaMainBundle:Theme');
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
				else if(is_dir($path.$file))
				{
					$theme = new Theme();
					$theme->setName($file);

					$em->persist($theme);
				}
			}
		}
		closedir($handle);

		$em->flush();

        $output->writeln('Update theme bdd done.');
    }
}

?>