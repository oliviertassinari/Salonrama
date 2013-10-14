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
        $dateTimeMax = date_modify(new \DateTime(), '-15 days');

        foreach($folderList as $folder)
        {
            $timestamp = substr($folder, 0, strpos($folder, '-'));

            if($timestamp < $dateTimeMax->getTimestamp())
            {
                File::removeFolder($path.$folder.'/');
                $output->writeln('Remove '.$folder);
            }
        }

        $em = $this->getContainer()->get('doctrine')->getManager();

        $qb = $em->createQueryBuilder('');
        $qb = $qb->select('u')
            ->add('from', 'Salonrama\MainBundle\Entity\User u')
            ->leftJoin('u.account', 'a')
            ->add('where', $qb->expr()->andX(
                $qb->expr()->eq('u.isActive', 0),
                $qb->expr()->lt('a.signin',':dateMax') // <
            ))
            ->setParameters(array('dateMax' => $dateTimeMax))
            ->getQuery()
        ;

        $queryResult = $qb->getResult();

        foreach($queryResult as $key => $value)
        {
           $em->remove($value->getAccount()->getSite());
           $em->remove($value->getAccount()->getSalon());
           $em->remove($value->getAccount());
           $em->remove($value);
           $output->writeln('Remove '.$value->getEmail());
        }

        $em->flush();

        $output->writeln('Clean buildsite step done.');
    }
}

?>