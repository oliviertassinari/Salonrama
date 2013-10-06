<?php 

namespace Salonrama\MainBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class MailerCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('mailer:signin')
            ->setDescription("Envoie d'email")
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
		$mailer = $this->getContainer()->get('salonrama_main_mailer');
		$mailer->sendSignin('contact@salonrama.fr', 'Olivier Tassinari', 'tdc.salonrama.fr');

        $output->writeln('done');
    }
}

?>