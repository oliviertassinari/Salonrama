<?php 

namespace Salonrama\MainBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Salonrama\MainBundle\File;

class BuildsiteAssemblerCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('buildsite:assembler:all')
            ->setDescription("Généere tout les sites")
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
       File::emptyFolderFolder('web/site/online/');
       File::emptyFolderFolder('web/site/step/');
       File::emptyFolderFolder('web/site/subdomain/');

       
    }
}

?>