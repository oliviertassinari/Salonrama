<?php 

namespace Salonrama\MainBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Salonrama\MainBundle\File;

class ResetCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('reset:all')
            ->setDescription("Réinitisalisation")
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        File::emptyFolderFolder('web/site/online/');
        File::emptyFolderFolder('web/site/step/');
        File::emptyFolderFolder('web/site/subdomain/');

        $em = $this->getContainer()->get('doctrine')->getManager();

        $connection = $em->getConnection();
        $dbPlatform = $connection->getDatabasePlatform();
        $connection->query('SET FOREIGN_KEY_CHECKS=0');
        $connection->executeUpdate($dbPlatform->getTruncateTableSql('user'));
        $connection->executeUpdate($dbPlatform->getTruncateTableSql('account'));
        $connection->executeUpdate($dbPlatform->getTruncateTableSql('site'));
        $connection->executeUpdate($dbPlatform->getTruncateTableSql('salon'));
        $connection->query('SET FOREIGN_KEY_CHECKS=1');

        $output->writeln('Reset done.');
    }
}

?>