<?php 

namespace Salonrama\MainBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Salonrama\MainBundle\File;

class BuildsiteCleanCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('buildsite:clean')
            ->setDescription("Généere tout les sites")
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
       
    }
}

?>