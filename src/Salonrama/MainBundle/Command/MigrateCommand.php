<?php 

namespace Salonrama\MainBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Salonrama\MainBundle\File;

class MigrateCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('migrate:run')
            ->setDescription("Migration de la v1 a la v2")
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {

    	
        $output->writeln('Migration done.');
    }
}

?>