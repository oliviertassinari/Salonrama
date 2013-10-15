<?php 

namespace Salonrama\MainBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Salonrama\MainBundle\File;

class BuildsiteAssembleCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('buildsite:assemble:clean')
            ->setDescription("Nettoyer les sites inachevées")
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
       
    }
}

?>