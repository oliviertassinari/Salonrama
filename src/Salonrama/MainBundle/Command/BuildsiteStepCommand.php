<?php 

namespace Salonrama\MainBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Salonrama\MainBundle\File;

class BuildsiteStepCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('buildsite:step:clean')
            ->setDescription("Nettoyer les sites inachevées")
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $path = 'web/site/step/';
        $folderList = File::getFolderList($path);
        $timestampMax = time() - 86400*15; // plus de 15 jours

        foreach($folderList as $folder)
        {
            $timestamp = substr($folder, 0, strpos($folder, '-'));

            if($timestamp > $timestampMax)
            {
                File::removeFolder($path.$folder.'/');
                $output->writeln('delete '.$folder);
            }
        }

        $em = $this->getContainer()->get('doctrine')->getManager();

        $qb = $em->createQueryBuilder('a');
        $qb->delete('User', 'u')
            ->delete('Account', 'a')
            ->delete('Site', 'si')
            ->delete('Salon', 'sa')
            ->leftJoin('s.project','p');
            ->add('where', $qb->expr()->andX(
                $qb->expr()->eq('u.is_active', false)
                $qb->expr()->eq('a.signin', ':project')
            ))
        ;


        $output->writeln('Clean buildsite step done.');
    }
}

?>